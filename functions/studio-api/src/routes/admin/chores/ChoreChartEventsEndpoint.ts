import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AdminRequest } from '../../../services/Auth';
import LoggerFactory from '../../../services/Logger';
import { ChoreService } from '../../../services/ChoreService';
import ErrorResponse from '../../../utilities/ErrorResponse';
import { RouterClass } from '../../BaseEndpoint';
import AdminEndpoint from '../AdminEndpoint';
import ChoreChartEvents, {
  ChoreChartEventOutput,
  ChoreEventStatus
} from '../../../data/models/ChoreChartEvent';
import { Paged, pagingFromRequest } from '../../../utilities/Pagination';
import moment from 'moment';
import ChoreChart from '../../../data/models/ChoreChart';

@injectable()
export class ChoreChartEventsEndpoint
  extends AdminEndpoint
  implements RouterClass
{
  private choreService: ChoreService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(ChoreService) choreService: ChoreService
  ) {
    super(harness, loggerFactory);
    this.choreService = choreService;
  }

  public mountRoutes() {
    // base = '/admin/chore-charts'
    this.router.get('/:chartId/events', this.getChoreChartEvents.bind(this));
    this.router.patch(
      '/:chartId/events/:eventId',
      this.patchChoreChartEvents.bind(this)
    );
  }

  /*
    Fetch all ChoreChartEvents
  */
  async getChoreChartEvents(
    req: AdminRequest
  ): Promise<Paged<ChoreChartEventOutput>> {
    this.logger.info('fetching charts...');
    const paging = pagingFromRequest(req);
    if (paging.errorMessage) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, paging.errorMessage);
    }

    // check chart exists and authenticated user is the owner
    const chartId = this.getChartId(req);
    const chart = await ChoreChart.findByPk(chartId);
    if (!chart || chart.createdBy !== req.user?.id) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chart with owner id ${req.user?.id} and chart id ${chartId}`
      );
    }

    // attempt to create
    const eventsCreated = await this.choreService.createChoreEventsIfNeeded(
      chartId
    );
    if (eventsCreated) {
      this.logger.info(`Created chore chart ${chartId} events for this week`);
    }

    let sinceDate: Date | undefined;
    if (req.query.filter) {
      switch (req.query.filter) {
        case 'today':
          sinceDate = moment().startOf('day').toDate();
          break;
        case 'week':
          sinceDate = moment().startOf('week').toDate();
          break;
        default:
          this.logger.info(
            `Ignoring unsupported filter type in query params: ${req.query.filter}`
          );
      }
    }
    return await this.choreService.getChartEventsForOwner(
      chartId,
      sinceDate,
      paging
    );
  }

  /*
    Update a ChoreChartEvents with a partial model
  */
  async patchChoreChartEvents(
    req: AdminRequest
  ): Promise<ChoreChartEventOutput> {
    const chartId: string = this.getChartId(req);
    if (!req.params.eventId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing or bad endpoint param: eventId'
      );
    }

    const eventId: string = req.params.eventId;

    this.logger.info('patching chore chart with chartId' + chartId);
    const chart = await ChoreChart.findByPk(chartId);
    if (!chart || chart.createdBy !== req.user?.id) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chart with owner id ${req.user?.id} and chart id ${chartId}`
      );
    }

    const chartEvent = await ChoreChartEvents.findByPk(eventId);
    if (!chartEvent) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chore-chart-event with id: ${eventId}`
      );
    }

    // status can change
    if (req.body.status) {
      const status = this.resolveEventStatus(req.body.status);
      chartEvent.status = status;
      chartEvent._status = status.toString();
    }

    // rating can change
    if (req.body.rating) {
      const newRating = parseInt(req.body.rating, 10);
      if (isNaN(newRating)) {
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          `Invalid input for rating: ${req.body.rating}`
        );
      }
      if (newRating > 5 || newRating < 0) {
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          `Bad input for rating field: ${newRating}`
        );
      }
      chartEvent.rating = newRating;
    }

    // update and return the event
    await chartEvent.save();
    return chartEvent.toJSON();
  }

  public resolveEventStatus(status: string): ChoreEventStatus {
    switch (status.toUpperCase()) {
      case ChoreEventStatus.COMPLETED.toString():
        return ChoreEventStatus.COMPLETED;
      case ChoreEventStatus.NEEDS_CHECK.toString():
        return ChoreEventStatus.NEEDS_CHECK;
      case ChoreEventStatus.TODO.toString():
        return ChoreEventStatus.TODO;
      default:
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          `Bad input for status: ${status}`
        );
    }
  }

  private getChartId(req: AdminRequest): string {
    if (!req.params.chartId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing request param: chartId'
      );
    }

    return `${req.params.chartId}`;
  }
}

export default ChoreChartEventsEndpoint;
