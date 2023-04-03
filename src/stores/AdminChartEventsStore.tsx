import {
  ChoreEventStatus,
  PagedResponse,
  StudioApiAdminChart,
  StudioApiAdminCharts,
  StudioApiChartEvent
} from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { ChoreChartService } from '../services/ChoreChartService';
import { Token } from '../util/Auth';

class AdminChartEventsStore {
  public charts?: StudioApiAdminCharts;
  public api: ChoreChartService = new ChoreChartService();

  public eventsInTodo: StudioApiChartEvent[] = [];
  public eventsInNeedsCheck: StudioApiChartEvent[] = [];
  public eventsInDone: StudioApiChartEvent[] = [];

  constructor() {
    makeObservable(this, {
      charts: observable,
      eventsInTodo: observable,
      eventsInNeedsCheck: observable,
      eventsInDone: observable,
      reorder: action,
      fetchAdminChartEvents: action,
      getEventAtIndex: action
    });
  }

  public async fetchAdminChartEvents(): Promise<void> {
    const token = Token.fromCache();
    const resp: PagedResponse<StudioApiAdminChart> =
      await this.api.getAdminCharts(token);

    runInAction(() => {
      this.charts = resp;
      this.eventsInTodo = [];
      this.eventsInNeedsCheck = [];
      this.eventsInDone = [];
    });

    for (const chart of resp.results || []) {
      const evResp = await this.api.getAdminChartEvents(token, chart.id);
      if (evResp) {
        runInAction(() => {
          (evResp?.results || []).forEach((ev) => {
            switch (ev.status) {
              case ChoreEventStatus.TODO:
                this.eventsInTodo.push(ev);
                break;
              case ChoreEventStatus.NEEDS_CHECK:
                this.eventsInNeedsCheck.push(ev);
                break;
              case ChoreEventStatus.COMPLETED:
                this.eventsInDone.push(ev);
                break;
            }
          });
        });
      }
    }
  }

  public reorder() {
    const events = [
      ...this.eventsInTodo,
      ...this.eventsInNeedsCheck,
      ...this.eventsInDone
    ];

    this.eventsInTodo = [];
    this.eventsInNeedsCheck = [];
    this.eventsInDone = [];

    events.forEach((ev) => {
      switch (ev.status) {
        case ChoreEventStatus.TODO:
          this.eventsInTodo.push(ev);
          break;
        case ChoreEventStatus.NEEDS_CHECK:
          this.eventsInNeedsCheck.push(ev);
          break;
        case ChoreEventStatus.COMPLETED:
          this.eventsInDone.push(ev);
          break;
      }
    });
  }

  public getEventAtIndex(
    index: number,
    sourceStatus: ChoreEventStatus
  ): StudioApiChartEvent | undefined {
    switch (sourceStatus) {
      case ChoreEventStatus.TODO:
        return this.eventsInTodo[index];
      case ChoreEventStatus.NEEDS_CHECK:
        return this.eventsInNeedsCheck[index];
      case ChoreEventStatus.COMPLETED:
        return this.eventsInDone[index];
    }
  }

  public async markStatus(
    event: StudioApiChartEvent,
    targetStatus: ChoreEventStatus
  ) {
    event.status = targetStatus;
    this.api.updateEvent(Token.fromCache(), event);
  }
}

export const AdminChartEventsState = new AdminChartEventsStore();
