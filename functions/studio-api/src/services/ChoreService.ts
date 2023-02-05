import moment from 'moment';
import { Op, Transaction, WhereOptions } from 'sequelize';
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
      include: [Chore],
      limit: offsetOptions.limit,
      offset: offsetOptions.offset
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

  public async getChoreChartByName(
    name: string
  ): Promise<ChoreChart | undefined> {
    return (await ChoreChart.findOne({ where: { name } })) || undefined;
  }

  public async getChoreByName(name: string): Promise<Chore | undefined> {
    return (await Chore.findOne({ where: { name } })) || undefined;
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
          include: [Chore],
          transaction: t
        });

        if (!chart) {
          throw new Error(`Unable to find chore-chart with id ${chartId}`);
        }

        if (!chart.recurring) {
          return; // no need for recurring event creation
        }
        const currentEvents = await ChoreChartEvent.findAll({
          where: {
            choreChartId: chartId,
            created: {
              [Op.gt]: moment().startOf('week').toDate()
            }
          },
          transaction: t
        });

        if (
          // check if events are missing for this week
          (!currentEvents || currentEvents.length <= 0) &&
          (chart?.Chores || []).length > 0
        ) {
          // create the events for this week
          for (const chore of chart.Chores) {
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
    assigneeUserId: string
  ): Promise<ChoreChartData[]> {
    const startOfWeek = moment().startOf('week').toDate();
    this.logger.info(
      `Fetching chart data for user ${assigneeUserId} since ${startOfWeek.toISOString()}`
    );
    const results: Array<ChoreChartData> = [];
    if (!assigneeUserId) {
      throw new Error('Missing param user id! ' + assigneeUserId);
    }

    const charts: ChoreChart[] = await ChoreChart.findAll({
      where: {
        assignee: assigneeUserId
      },
      include: [Chore]
    });

    const thisWeeksEvents = await ChoreChartEvent.findAll({
      where: {
        choreChartId: [...charts.map((c) => c.id)],
        choreId: [
          ...charts
            .map((chart) => (chart.Chores || []).map((chore) => chore.id))
            .reduce((acc, idArr) => [...acc, ...idArr], [])
        ],
        created: {
          [Op.gt]: startOfWeek
        }
      }
    });

    for (const chart of charts) {
      const data: ChoreChartData = {
        chart,
        chores: chart.Chores,
        events: thisWeeksEvents.filter((ev) => ev.choreChartId === chart.id)
      };
      results.push(data);
    }

    return results;
  }
}
