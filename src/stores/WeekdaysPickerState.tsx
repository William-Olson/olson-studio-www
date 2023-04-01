import { observable, action, makeObservable } from 'mobx';
import moment from 'moment';

const dayMap: { [k: string]: number } = {
  M: 1,
  T: 2,
  W: 3,
  R: 4,
  F: 5,
  S: 6,
  U: 7
};

class WeekdaysPickerStore {
  public days?: boolean[];

  constructor() {
    makeObservable(this, {
      days: observable,
      selectDay: action,
      initDays: action,
      fromInput: action,
      dayName: action
    });
  }

  public fromInput(scheduleDays: string): void {
    const dayIndices: Set<number> = new Set(
      scheduleDays.split(',').map((d) => dayMap[d.toUpperCase()] || dayMap.S)
    );

    this.initDays([1, 2, 3, 4, 5, 6, 7].map((d) => dayIndices.has(d)));
  }

  public toScheduleDays(): string {
    return (this.days || [])
      .map((selected: boolean, index: number) =>
        selected ? this.daySymbol(index) : undefined
      )
      .filter((x) => x)
      .join(',');
  }

  public initDays(days?: boolean[]): void {
    if (days && days.length > 0) {
      this.days = days;
    } else {
      this.days = [false, false, false, false, false, false, false];
    }
  }

  public selectDay(dayIndex: number, selected: boolean): void {
    if (!this.days || !this.days.length || this.days.length <= dayIndex) {
      console.warn(`Unable to select day: ${dayIndex}, selected ${selected}`);
      return;
    }
    this.days[dayIndex] = selected;
  }

  public daySymbol(dayIndex: number): string | undefined {
    return Object.keys(dayMap).find((k) => dayMap[k] === dayIndex + 1);
  }

  public dayName(dayIndex: number): string {
    if (!this.days || !this.days.length || this.days.length <= dayIndex) {
      console.warn(`Unable to resolve name for day: ${dayIndex}`);
      return '';
    }
    return moment()
      .startOf('week')
      .day(dayIndex + 1)
      .format('dddd');
  }
}

export const WeekdaysPickerState = new WeekdaysPickerStore();
