import _ from 'lodash';
import moment from 'moment';
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { inject, singleton } from 'tsyringe';
import Chore, { ChoreOutput } from '../data/models/Chore';
import ChoreChart, { ChoreChartOutput } from '../data/models/ChoreChart';
import ChoreChartEvent, {
  ChoreChartEventInput,
  ChoreChartEventOutput,
  ChoreEventStatus
} from '../data/models/ChoreChartEvent';
import {
  Paged,
  PagingOptions,
  asOffset,
  asPagedResponse
} from '../utilities/Pagination';
import LoggerFactory, { Logger } from './Logger';

export interface ChoreChartData {
  chart?: ChoreChart;
  chores?: Array<Chore>;
  events?: Array<ChoreChartEvent>;
}

const CurrentChoresAndEvents: Includeable = {
  model: Chore,
  as: 'chores',
  required: false,
  include: [
    {
      model: ChoreChartEvent,
      where: {
        due: { [Op.gte]: moment().startOf('week').toDate() }
      },
      as: 'events',
      required: false
    }
  ]
};

/*
  ChoreService
  Provides functionality and operations around Chores, Chore Charts, and Chore Events.
*/
@singleton()
export class ChoreService {
  private logger: Logger;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(`app:services:${ChoreService.name}`);
  }

  public async getCharts(
    paging?: PagingOptions
  ): Promise<Paged<ChoreChartOutput>> {
    const offsetOptions = asOffset(paging);
    const results = await ChoreChart.findAndCountAll({
      include: [CurrentChoresAndEvents],
      limit: offsetOptions.limit,
      offset: offsetOptions.offset,
      distinct: true
    });

    return asPagedResponse(results, offsetOptions);
  }

  public async getChores(
    chartId: string,
    paging?: PagingOptions
  ): Promise<Paged<ChoreOutput>> {
    const offsetOptions = asOffset(paging);
    const results = await Chore.findAndCountAll({
      where: { choreChartId: chartId },
      order: [['id', 'ASC']],
      limit: offsetOptions.limit,
      offset: offsetOptions.offset
    });

    return asPagedResponse(results, offsetOptions);
  }

  public async getChartEventsForOwner(
    chartId: string,
    sinceDate: Date | undefined,
    paging?: PagingOptions
  ): Promise<Paged<ChoreChartEventOutput>> {
    const offsetOptions = asOffset(paging);

    const where: WhereOptions<ChoreChartEvent> = {
      choreChartId: chartId
    };

    if (sinceDate) {
      where.created = { [Op.gte]: sinceDate };
    }

    const results = await ChoreChartEvent.findAndCountAll({
      where,
      order: [['id', 'ASC']],
      limit: offsetOptions.limit,
      offset: offsetOptions.offset
    });

    return asPagedResponse(results, offsetOptions);
  }

  /*
    Lookup a chart by name
  */
  public async getChoreChartByName(
    name: string
  ): Promise<ChoreChart | undefined> {
    return (await ChoreChart.findOne({ where: { name } })) || undefined;
  }

  public async getChoreByName(name: string): Promise<Chore | undefined> {
    return (await Chore.findOne({ where: { name } })) || undefined;
  }

  /*
    Create events for all charts that are assigned to the user with id equal to the
    assigneeId param.
  */
  public async createAssigneeEventsIfNeeded(
    assigneeId: string
  ): Promise<boolean> {
    let result = false;

    const charts = await ChoreChart.findAll({
      attributes: ['id'],
      where: { assignee: assigneeId }
    });

    for (const { id } of charts || []) {
      this.logger.info(`Creating events for chart ${id}...`);
      const wereEventsCreated = await this.createAssigneeEventsIfNeeded(id);
      result = result || wereEventsCreated;
    }
    return result;
  }

  /*
    Create chore chart events for the week if they haven't been created yet
  */
  public async createChoreEventsIfNeeded(chartId: string): Promise<boolean> {
    let hasCreatedEvents = false;
    await ChoreChartEvent.sequelize?.transaction(
      {
        type: Transaction.TYPES.EXCLUSIVE,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      },
      async (t: Transaction) => {
        const chart = await ChoreChart.findByPk(chartId, {
          include: [CurrentChoresAndEvents],
          transaction: t
        });

        if (!chart) {
          throw new Error(`Unable to find chore-chart with id ${chartId}`);
        }

        if (!chart.recurring) {
          return; // no need for recurring event creation
        }

        // flatten out the events from the query
        const currentEvents = _.flatMap(
          chart.chores,
          ({ events }) => events || []
        );

        if (
          // check if events are missing for this week
          (!currentEvents || currentEvents.length <= 0) &&
          (chart?.chores || []).length > 0
        ) {
          // create the events for this week
          for (const chore of chart.chores) {
            await this.createChoreChartEvent(chart, chore, t);
          }
          hasCreatedEvents = true;
        }
      }
    );
    return hasCreatedEvents;
  }

  /*
    Create chore chart events for a chore under an existing db transaction
  */
  private async createChoreChartEvent(
    chart: ChoreChart,
    chore: Chore,
    trx: Transaction
  ) {
    const dayMap: { [k: string]: number } = {
      M: 1,
      T: 2,
      W: 3,
      R: 4,
      F: 5,
      S: 6,
      U: 7
    };
    const days = chore.scheduleDays
      .split(',')
      .map((d) => dayMap[d.toUpperCase()] || dayMap.S);

    for (const day of days) {
      const eventDate = moment().startOf('week').day(day).format('YYYY-MM-DD');
      const dueDate = moment(eventDate + ' ' + chart.dueTime);
      const eventInput: ChoreChartEventInput = {
        choreChartId: chart.id,
        choreId: chore.id,
        _status: ChoreEventStatus.TODO.toString(),
        due: dueDate.toDate(),
        rating: 0
      };
      this.logger.info(
        `Creating chore chart event [${chart.id}:${chore.id}] ${dueDate
          .toDate()
          .toISOString()}`
      );
      await ChoreChartEvent.create(eventInput, { transaction: trx });
    }
  }

  /*
    Fetches chart data for a given assignee user id
  */
  public async getCurrentChoresForUser(
    assigneeUserId: string,
    pagination?: PagingOptions
  ): Promise<Paged<ChoreChartOutput>> {
    const startOfWeek = moment().startOf('week').toDate();
    this.logger.info(
      `Fetching chart data for user ${assigneeUserId} since ${startOfWeek.toISOString()}`
    );

    if (!assigneeUserId) {
      throw new Error('Missing param user id! ' + assigneeUserId);
    }

    const paged = asOffset(pagination);
    const assigneeCharts = await ChoreChart.findAndCountAll({
      where: {
        assignee: assigneeUserId
      },
      limit: paged.limit,
      offset: paged.offset,
      include: [CurrentChoresAndEvents],
      distinct: true
    });
    return asPagedResponse(assigneeCharts, paged);
  }
}
