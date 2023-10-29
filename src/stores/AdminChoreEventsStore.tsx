import {
  ChoreEventStatus,
  PagedResponse,
  StudioApiChoreChart,
  StudioApiAdminCharts,
  StudioApiChore,
  StudioApiChoreEvent
} from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { ChoreChartService } from '../services/ChoreChartService';
import { Token } from '../util/Auth';
import moment from 'moment';
import { BaseChoreEventsStore } from './UserChoreEventsStore';

class AdminChoreEventsStore extends BaseChoreEventsStore {
  public charts?: StudioApiAdminCharts;
  public api: ChoreChartService = new ChoreChartService();

  constructor() {
    super();
    makeObservable(this, {
      charts: observable,
      fetchEvents: action,
      getEventChart: action,
      getEventChore: action,
      markStatus: action
    });
  }

  public async fetchEvents(): Promise<void> {
    this.loading = true;
    const token = Token.fromCache();
    const resp: PagedResponse<StudioApiChoreChart> =
      await this.api.getAdminCharts(token);

    if (!resp || !resp.results) {
      this.loading = false;
      return;
    }

    runInAction(() => {
      this.charts = resp;
    });

    const ensureExclusive = this.getExclusiveChecker();

    const today = moment().format('MM-DD');
    for (const chart of resp.results || []) {
      const evResp = await this.api.getAdminChartEvents(token, chart.id);
      if (evResp) {
        runInAction(() => {
          (evResp?.results || []).forEach((ev) => {
            if (moment(ev.due).format('MM-DD') !== today) {
              return;
            }
            ensureExclusive(ev);
          });
        });
      }
    }
    this.loading = false;
  }

  public getEventChart(
    event: StudioApiChoreEvent
  ): StudioApiChoreChart | undefined {
    return this.charts?.results?.find((c) => c.id === event.choreChartId);
  }

  public getEventChore(
    event: StudioApiChoreEvent,
    chart?: StudioApiChoreChart
  ): StudioApiChore | undefined {
    if (!chart) {
      chart = this.getEventChart(event);
    }
    return chart?.chores?.find((c) => c.id === event.choreId);
  }

  public async markStatus(
    event: StudioApiChoreEvent,
    targetStatus: ChoreEventStatus
  ) {
    event.status = targetStatus;
    await this.api.updateAdminChoreEvent(Token.fromCache(), event);
  }
}

export const AdminChoreEventsState = new AdminChoreEventsStore();
