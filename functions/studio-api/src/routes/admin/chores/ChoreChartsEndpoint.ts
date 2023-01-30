import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AdminRequest, AuthRequest } from '../../../services/Auth';
import LoggerFactory from '../../../services/Logger';
import { ChoreService } from '../../../services/ChoreService';
import ErrorResponse from '../../../utilities/ErrorResponse';
import { RouterClass } from '../../BaseEndpoint';
import AdminEndpoint from '../AdminEndpoint';
import ChoreChart, {
  ChoreChartInput,
  ChoreChartOutput
} from '../../../data/models/ChoreChart';
import { Paged, pagingFromRequest } from '../../../utilities/Pagination';
import _ from 'lodash';
import { UserService } from '../../../services/UserService';

@injectable()
export class ChoreChartsEndpoint extends AdminEndpoint implements RouterClass {
  private choreService: ChoreService;
  private userService: UserService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(ChoreService) choreService: ChoreService,
    @inject(UserService) userService: UserService
  ) {
    super(harness, loggerFactory);
    this.choreService = choreService;
    this.userService = userService;
  }

  public mountRoutes() {
    this.router.get('/', this.getChoreCharts.bind(this));
    this.router.post('/', this.createChoreChart.bind(this));
    this.router.patch('/:id', this.patchChoreChart.bind(this));
    this.router.delete('/:id', this.deleteChoreChart.bind(this));
  }

  /*
    Fetch all ChoreCharts
  */
  async getChoreCharts(req: AdminRequest): Promise<Paged<ChoreChartOutput>> {
    this.logger.info('fetching charts...');
    const paging = pagingFromRequest(req);
    if (paging.errorMessage) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, paging.errorMessage);
    }
    return await this.choreService.getCharts(paging);
  }

  /*
    Create a new ChoreChart
  */
  async createChoreChart(req: AdminRequest): Promise<ChoreChartOutput> {
    if (!req.user) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        'User session data missing from request'
      );
    }

    // ensure fields exist
    const requiredFields = ['name', 'assignee', 'description', 'dueTime'];
    this.throwOnMissing(req, ['name', 'assignee', 'description', 'dueTime']);
    const existingChart = await this.choreService.getChoreChartByName(
      req.body.name
    );
    if (existingChart) {
      throw new ErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Chore chart already exists with name: ${req.body.name}`
      );
    }

    const inputData: ChoreChartInput = Object.assign(
      {},
      _.pick(req.body, [...requiredFields, 'recurring']),
      {
        createdBy: req.user.id
      }
    ) as ChoreChartInput;

    // create the chart
    this.logger.info('creating a new chore chart with name ' + req.body.name);
    return (await ChoreChart.create(inputData)).toJSON();
  }

  /*
    Update a ChoreChart with a partial model
  */
  async patchChoreChart(req: AdminRequest): Promise<ChoreChartOutput> {
    if (!req.params.id || isNaN(parseInt(req.params.id, 10))) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing endpoint param: id'
      );
    }
    const id: number = parseInt(`${req.params.id}`, 10);
    this.logger.info('patching chore chart with id' + id);
    const chart: ChoreChart | null = await ChoreChart.findByPk(id);

    if (!chart) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chore-chart with id: ${id}`
      );
    }

    // make sure no duplicate name exists
    if (req.body.name) {
      const existing = await this.choreService.getChoreChartByName(
        req.body.name
      );
      if (existing && existing.id !== id) {
        throw new ErrorResponse(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Chore chart already exists with name: ${req.body.name}`
        );
      }
    }

    // make sure assignee exists if provided
    if (req.body.assignee) {
      const assignee = await this.userService.getById(req.body.assignee);
      if (!assignee) {
        throw new ErrorResponse(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Unable to find user with id ${req.body.assignee} for chore-chart assignee`
        );
      }
    }

    // update allowed fields
    Object.assign(
      chart,
      _.pick(req.body, [
        'name',
        'assignee',
        'description',
        'dueTime',
        'streak',
        'score',
        'recurring'
      ])
    );
    await chart.save();

    // return the chart
    return chart.toJSON();
  }

  /*
    Delete a ChoreChart
  */
  public async deleteChoreChart(req: AdminRequest) {
    if (!req.params.id) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing endpoint param: id'
      );
    }
    this.logger.info('patching chore chart with id' + req.params.id);
    const chart: ChoreChart | null = await ChoreChart.findByPk(req.params.id);

    if (!chart) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chore-chart with id: ${req.params.id}`
      );
    }

    await chart.destroy();
    return { success: true, deleted: chart.toJSON() };
  }

  private throwOnMissing(req: AuthRequest | AdminRequest, propList: string[]) {
    for (const prop of propList) {
      if (!req.body[prop]) {
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          'Missing required field: ' + prop
        );
      }
    }
  }
}

export default ChoreChartsEndpoint;
