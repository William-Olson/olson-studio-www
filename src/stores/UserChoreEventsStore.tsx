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

export abstract class BaseChoreEventsStore {
  public eventsInTodo: StudioApiChoreEvent[] = [];
  public eventsInNeedsCheck: StudioApiChoreEvent[] = [];
  public eventsInDone: StudioApiChoreEvent[] = [];

  public loading = false;

  public abstract getEventChart(
    event: StudioApiChoreEvent
  ): StudioApiChoreChart | undefined;

  public abstract getEventChore(
    event: StudioApiChoreEvent,
    chart?: StudioApiChoreChart
  ): StudioApiChore | undefined;

  public abstract markStatus(
    event: StudioApiChoreEvent,
    targetStatus: ChoreEventStatus,
    isAdmin?: boolean
  ): Promise<void>;

  public abstract fetchEvents(): Promise<void>;

  constructor() {
    makeObservable(this, {
      loading: observable,
      eventsInTodo: observable,
      eventsInNeedsCheck: observable,
      eventsInDone: observable,
      reorder: action,
      getEventAtIndex: action
    });
  }

  /*
    Returns event at given status column and index position.
  */
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

  /*
    Moves the event from the given status column and index to the
    target column and index position.
  */
  public reorder(
    fromStatus: ChoreEventStatus,
    fromIndex: number,
    toStatus: ChoreEventStatus,
    toIndex: number
  ) {
    this.loading = true;
    let eventToMove: StudioApiChoreEvent | undefined;
    let rmCount = 1;

    // remove
    switch (fromStatus) {
      case ChoreEventStatus.TODO:
        eventToMove = this.eventsInTodo.splice(fromIndex, rmCount)[0];
        break;
      case ChoreEventStatus.NEEDS_CHECK:
        eventToMove = this.eventsInNeedsCheck.splice(fromIndex, rmCount)[0];
        break;
      case ChoreEventStatus.COMPLETED:
        eventToMove = this.eventsInDone.splice(fromIndex, rmCount)[0];
        break;
    }

    // insert
    rmCount = 0;
    switch (toStatus) {
      case ChoreEventStatus.TODO:
        this.eventsInTodo.splice(toIndex, rmCount, eventToMove);
        break;
      case ChoreEventStatus.NEEDS_CHECK:
        this.eventsInNeedsCheck.splice(toIndex, rmCount, eventToMove);
        break;
      case ChoreEventStatus.COMPLETED:
        this.eventsInDone.splice(toIndex, rmCount, eventToMove);
        break;
    }
    this.loading = false;
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
      getEventChore: action,
      markStatus: action
    });
  }

  public async fetchEvents(): Promise<void> {
    this.loading = true;
    const token = Token.fromCache();
    const resp: PagedResponse<StudioApiChoreChart> | undefined =
      await this.api.getUserChoreEvents(token);

    if (!resp) {
      console.warn('issue fetching chore events');
      this.loading = false;
      return;
    }

    runInAction(() => {
      this.charts = resp;
    });

    const inTodo = new Set((this.eventsInTodo || []).map((e) => e.id));
    const inNeedsCheck = new Set(
      (this.eventsInNeedsCheck || []).map((e) => e.id)
    );
    const inDone = new Set((this.eventsInDone || []).map((e) => e.id));

    const today = moment().format('MM-DD');
    for (const chart of resp.results || []) {
      const chartEvents = _.flatMap(chart.chores, ({ events }) => events || []);
      if (!!chartEvents && !!chartEvents.length) {
        runInAction(() => {
          chartEvents.forEach((ev) => {
            if (moment(ev.due).format('MM-DD') !== today) {
              return;
            }
            switch (ev.status) {
              case ChoreEventStatus.TODO:
                if (!inTodo.has(ev.id)) {
                  this.eventsInTodo.push(ev);
                }
                break;
              case ChoreEventStatus.NEEDS_CHECK:
                if (!inNeedsCheck.has(ev.id)) {
                  this.eventsInNeedsCheck.push(ev);
                }
                break;
              case ChoreEventStatus.COMPLETED:
                if (!inDone.has(ev.id)) {
                  this.eventsInDone.push(ev);
                }
                break;
            }
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
    targetStatus: ChoreEventStatus,
    isAdmin?: boolean
  ): Promise<void> {
    if (isAdmin) {
      event.status = targetStatus;
      await this.api.updateAdminChoreEvent(Token.fromCache(), event);
    } else if (
      // non-admins can only move to/from these statuses
      targetStatus === ChoreEventStatus.TODO ||
      targetStatus === ChoreEventStatus.NEEDS_CHECK
    ) {
      event.status = targetStatus;
      await this.api.updateChoreEvent(Token.fromCache(), event);
    }
  }
}

export const UserChoreEventsState = new UserChoreEventsStore();
