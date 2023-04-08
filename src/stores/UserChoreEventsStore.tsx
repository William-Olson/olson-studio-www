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
import _ from 'lodash';

export class BaseChoreEventsStore {
  public eventsInTodo: StudioApiChoreEvent[] = [];
  public eventsInNeedsCheck: StudioApiChoreEvent[] = [];
  public eventsInDone: StudioApiChoreEvent[] = [];

  constructor() {
    makeObservable(this, {
      eventsInTodo: observable,
      eventsInNeedsCheck: observable,
      eventsInDone: observable,
      reorder: action,
      getEventAtIndex: action
    });
  }
  public getEventAtIndex(
    index: number,
    sourceStatus: ChoreEventStatus
  ): StudioApiChoreEvent | undefined {
    switch (sourceStatus) {
      case ChoreEventStatus.TODO:
        return this.eventsInTodo[index];
      case ChoreEventStatus.NEEDS_CHECK:
        return this.eventsInNeedsCheck[index];
      case ChoreEventStatus.COMPLETED:
        return this.eventsInDone[index];
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
}

class UserChoreEventsStore extends BaseChoreEventsStore {
  public charts?: StudioApiAdminCharts;
  public api: ChoreChartService = new ChoreChartService();

  constructor() {
    super();
    makeObservable(this, {
      charts: observable,
      fetchEvents: action,
      getEventChart: action,
      getEventChore: action
    });
  }

  public async fetchEvents(): Promise<void> {
    const token = Token.fromCache();
    const resp: PagedResponse<StudioApiChoreChart> | undefined =
      await this.api.getUserChoreEvents(token);

    if (!resp) {
      console.warn('issue fetching chore events');
      return;
    }

    runInAction(() => {
      this.charts = resp;
      this.eventsInTodo = [];
      this.eventsInNeedsCheck = [];
      this.eventsInDone = [];
    });

    const today = moment().format('MM-DD');
    for (const chart of resp.results || []) {
      const choreEvents = _.flatMap(chart.chores, ({ events }) => events || []);
      if (!!choreEvents && !!choreEvents.length) {
        runInAction(() => {
          choreEvents.forEach((ev) => {
            if (moment(ev.due).format('MM-DD') !== today) {
              return;
            }
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
    this.api.updateEvent(Token.fromCache(), event);
  }
}

export const UserChoreEventsState = new UserChoreEventsStore();
