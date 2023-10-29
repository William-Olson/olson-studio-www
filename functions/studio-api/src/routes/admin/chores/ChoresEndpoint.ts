import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AdminRequest, AuthRequest } from '../../../services/Auth';
import LoggerFactory from '../../../services/Logger';
import { ChoreService } from '../../../services/ChoreService';
import ErrorResponse from '../../../utilities/ErrorResponse';
import { RouterClass } from '../../BaseEndpoint';
import AdminEndpoint from '../AdminEndpoint';
import ChoreChart from '../../../data/models/ChoreChart';
import { Paged, pagingFromRequest } from '../../../utilities/Pagination';
import _ from 'lodash';
import Chore, { ChoreInput, ChoreOutput } from '../../../data/models/Chore';

@injectable()
export class ChoresEndpoint extends AdminEndpoint implements RouterClass {
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
    this.router.get('/:id/chores/', this.getChores.bind(this));
    this.router.post('/:id/chores/', this.createChore.bind(this));
    this.router.patch('/:id/chores/:choreId', this.patchChore.bind(this));
    this.router.delete('/:id/chores/:choreId', this.deleteChore.bind(this));
  }

  /*
    Fetch all Chores
  */
  async getChores(req: AdminRequest): Promise<Paged<ChoreOutput>> {
    this.logger.info('fetching charts...');
    const paging = pagingFromRequest(req);
    if (paging.errorMessage) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, paging.errorMessage);
    }

    const chart = await ChoreChart.findByPk(req.params.id);
    if (!chart) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chart with id: ${req.params.id}`
      );
    }

    return await this.choreService.getChores(chart.id, paging);
  }

  /*
    Create a new Chore
  */
  async createChore(req: AdminRequest): Promise<ChoreOutput> {
    if (!req.user) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        'User session data missing from request'
      );
    }

    // ensure fields exist
    const requiredFields = ['name', 'description', 'scheduleDays'];
    this.throwOnMissing(req, requiredFields);
    const existingChart = await ChoreChart.findByPk(req.params.id);
    if (!existingChart) {
      throw new ErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Unable to find chart with id: ${req.params.id}`
      );
    }
    const existingChore = await this.choreService.getChoreByName(req.body.name);
    if (existingChore) {
      throw new ErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Chore already exists with name: ${req.body.name}`
      );
    }

    const inputData: ChoreInput = Object.assign(
      {},
      _.pick(req.body, requiredFields),
      {
        choreChartId: existingChart.id
      }
    ) as ChoreInput;

    // create the chore and events for this week
    this.logger.info('creating a new chore with name ' + req.body.name);
    const chore = await this.choreService.createChore(inputData, existingChart);

    if (!chore) {
      throw new ErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Unexpected error occurred. Unable to create chore for chart: ${req.params.id}`
      );
    }

    return chore.toJSON();
  }

  /*
    Update a ChoreChart with a partial model
  */
  async patchChore(req: AdminRequest): Promise<ChoreOutput> {
    if (!req.params.id || !req.params.choreId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing endpoint param: id'
      );
    }
    const choreId: string = req.params.choreId;
    this.logger.info('patching chore with id' + choreId);
    const chore: Chore | null = await Chore.findByPk(choreId);

    if (!chore) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chore with id: ${choreId}`
      );
    }

    // make sure no duplicate name exists
    if (req.body.name) {
      const existing = await this.choreService.getChoreByName(req.body.name);
      if (existing && existing.id !== choreId) {
        throw new ErrorResponse(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Chore already exists with name: ${req.body.name}`
        );
      }
    }

    // update allowed fields
    Object.assign(
      chore,
      _.pick(req.body, ['choreChartId', 'name', 'description', 'scheduleDays'])
    );
    await chore.save();

    // return the chore
    return chore.toJSON();
  }

  /*
    Delete a ChoreChart
  */
  public async deleteChore(req: AdminRequest) {
    if (!req.params.choreId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing endpoint param: id'
      );
    }
    this.logger.info('patching chore with id' + req.params.choreId);
    const chore: Chore | null = await Chore.findByPk(req.params.choreId);

    if (!chore) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        `Unable to find chore with id: ${req.params.choreId}`
      );
    }

    await chore.destroy();
    return { success: true, deleted: chore.toJSON() };
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

export default ChoresEndpoint;
