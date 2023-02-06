import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import ChoreChart, { ChoreChartOutput } from '../data/models/ChoreChart';
import ChoreChartEvent, {
  ChoreEventStatus
} from '../data/models/ChoreChartEvent';
import { AuthRequest } from '../services/Auth';
import { ChoreService } from '../services/ChoreService';
import LoggerFactory from '../services/Logger';
import ErrorResponse from '../utilities/ErrorResponse';
import { Paged } from '../utilities/Pagination';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class UserChoresEndpoint extends BaseEndpoint implements RouterClass {
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
    this.router.get('/', this.getUserChores.bind(this));
    this.router.patch('/', this.patchChore.bind(this));
  }

  async patchChore(req: AuthRequest) {
    if (!req.body.eventId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing required field in body: eventId'
      );
    }
    if (!req.body.status) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing required field in body: status'
      );
    }

    const choreEvent = await ChoreChartEvent.findByPk(req.body.eventId);
    if (!choreEvent) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find event with id ${req.body.eventId}`
      );
    }
    const chart = await ChoreChart.findByPk(choreEvent.choreChartId);
    if (!chart) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chart from event id ${req.body.eventId} ` +
          `and chart id ${choreEvent.choreChartId}`
      );
    }

    if (req.user?.id !== chart.assignee) {
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        `Unable to access event with id ${req.body.eventId}`
      );
    }

    // allow updating the status
    const status = this.resolveEventStatus(req.body.status);
    if (
      choreEvent.status !== status &&
      choreEvent.status !== ChoreEventStatus.COMPLETED
    ) {
      this.logger.info(
        `Updating chore event ${req.body.eventId} to status ${status}`
      );
      choreEvent.status = status;
      choreEvent._status = status.toString();
      await choreEvent.save();
    }

    return choreEvent.toJSON();
  }

  async getUserChores(req: AuthRequest): Promise<Paged<ChoreChartOutput>> {
    if (!req.user) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        'Request is missing user session data!'
      );
    }

    // ensure we have an authenticated user
    if (!req.user?.id) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        'Unable to find user with id: ' + req.user?.id
      );
    }

    const choreCharts = await this.choreService.getCurrentChoresForUser(
      req.user.id
    );
    const hasEvents = choreCharts.results.some(({ chores }) => {
      return _.flatMap(chores, ({ events }) => events).length > 0;
    });

    // return the data if events have already been created
    if (hasEvents) {
      return choreCharts;
    }

    // otherwise create events for this and return the refreshed data
    await this.choreService.createAssigneeEventsIfNeeded(req.user.id);
    return await this.choreService.getCurrentChoresForUser(req.user.id);
  }

  private resolveEventStatus(status: string): ChoreEventStatus {
    switch (status.toUpperCase()) {
      // assignees can only toggle between the two states
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
}

export default UserChoresEndpoint;
