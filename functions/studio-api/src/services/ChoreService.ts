import _ from 'lodash';
import moment from 'moment';
import { Includeable, Op, Transaction, WhereOptions } from 'sequelize';
import { inject, singleton } from 'tsyringe';
import Chore, { ChoreInput, ChoreOutput } from '../data/models/Chore';
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
import { LoggerFactory, Logger } from './Logger';

export interface ChoreChartData {
  chart?: ChoreChart;
  chores?: Array<Chore>;
  events?: Array<ChoreChartEvent>;
}

const includeEventsBetween: (
  afterDate: Date,
  beforeDate: Date
) => Includeable = (afterDate: Date, beforeDate: Date) => ({
  model: Chore,
  as: 'chores',
  required: false,
  include: [
    {
      where: {
        due: { [Op.between]: [afterDate, beforeDate] }
      },
      model: ChoreChartEvent,
      // where: {
      //   due: { [Op.gte]: afterDate.toISOString() }
      // },
      as: 'events',
      required: false
    }
  ]
});

const startOfWeek: () => Date = () => moment().startOf('week').toDate();
const endOfWeek: () => Date = () => moment().endOf('week').toDate();

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
      include: [includeEventsBetween(startOfWeek(), endOfWeek())],
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
      const wereEventsCreated = await this.createChoreEventsIfNeeded(id);
      result = result || wereEventsCreated;
    }
    return result;
  }

  /*
    Determines if the chore has events for this week.
    Note: relies on chore.events being populated.
  */
  public choreHasCurrentEvents(chore: Chore): boolean {
    const daysAssigned = chore.scheduleDays.split(',');
    const end = endOfWeek();
    const start = startOfWeek();
    const thisWeeksEvents = (chore.events || []).filter(({ due }) => {
      const m = moment(due);
      return m.isAfter(start) && m.isBefore(end);
    });
    return thisWeeksEvents.length === daysAssigned.length;
  }

  /*
    Creates a chore from input data along with the chore events
    for the current week.
  */
  public async createChore(
    choreData: ChoreInput,
    chart: ChoreChart
  ): Promise<Chore | null> {
    let chore: Chore | null = null;
    await ChoreChartEvent.sequelize?.transaction(
      {
        type: Transaction.TYPES.EXCLUSIVE,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
      },
      async (t: Transaction) => {
        chore = await Chore.create(choreData);
        await this.createChoreEvents(chart, chore, t);
        return chore;
      }
    );
    return chore;
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
          include: [includeEventsBetween(startOfWeek(), endOfWeek())],
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

        // create the events for this week
        for (const chore of chart.chores) {
          if (!this.choreHasCurrentEvents(chore)) {
            await this.createChoreEvents(chart, chore, t);
            hasCreatedEvents = true;
          }
        }
      }
    );
    return hasCreatedEvents;
  }

  private twelveToTwentyFour(lTTime: String): { hour: number; minute: number } {
    const hourStr = lTTime.substring(0, 2);
    const minStr = lTTime.substring(3, 5);
    const amPmStr = lTTime.substring(6, lTTime.length);

    if (amPmStr === 'AM') {
      return { hour: parseInt(hourStr, 10), minute: parseInt(minStr, 10) };
    } else {
      return { hour: parseInt(hourStr, 10) + 12, minute: parseInt(minStr, 10) };
    }
  }

  /*
    Create chore chart events for a chore under an existing db transaction
  */
  private async createChoreEvents(
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
      U: 0 // note: using 7 here will create an event in next weeks range, which we don't want
    };
    const cleanDayInput = (str: String) => (str || '').trim().toUpperCase();
    const days = chore.scheduleDays
      .split(',')
      .map(cleanDayInput)
      .filter((day) => !!day)
      .map((d) => dayMap[d]);

    for (const day of days) {
      const militaryTime = this.twelveToTwentyFour(chart.dueTime);
      const dueDate = moment()
        .startOf('week')
        .day(day)
        .set('hours', militaryTime.hour)
        .set('minutes', militaryTime.minute);

      const eventInput: ChoreChartEventInput = {
        choreChartId: chart.id,
        choreId: chore.id,
        _status: ChoreEventStatus.TODO.toString(),
        due: dueDate.toDate(),
        rating: 0
      };

      this.logger.info(
        `Creating chore chart event for day ${day} => [${chart.id}:${
          chore.id
        }] ${dueDate.toISOString()}`
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
    const startDate = startOfWeek();
    this.logger.info(
      `Fetching chart data for user ${assigneeUserId} since ${startDate.toISOString()}`
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
      include: [includeEventsBetween(startDate, endOfWeek())],
      distinct: true
    });
    return asPagedResponse(assigneeCharts, paged);
  }
}
