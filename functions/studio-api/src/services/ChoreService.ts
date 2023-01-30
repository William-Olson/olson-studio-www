import moment from 'moment';
import { Op } from 'sequelize';
import { inject, singleton } from 'tsyringe';
import Chore, { ChoreOutput } from '../data/models/Chore';
import ChoreChart, { ChoreChartOutput } from '../data/models/ChoreChart';
import ChoreChartEvent from '../data/models/ChoreChartEvent';
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
    chartId: number,
    paging?: PagingOptions
  ): Promise<Paged<ChoreOutput>> {
    const offsetOptions = asOffset(paging);
    this.logger.error('limit: ' + offsetOptions.limit);
    this.logger.error('offset: ' + offsetOptions.offset);
    const results = await Chore.findAndCountAll({
      where: { choreChartId: chartId },
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
    Fetches chart data for a given assignee user id
  */
  public async getCurrentChoresForUser(
    assigneeUserId: number
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
