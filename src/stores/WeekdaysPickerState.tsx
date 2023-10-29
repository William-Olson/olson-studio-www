import { observable, action, makeObservable, computed } from 'mobx';
import { dayMap, Days } from '../util/days';

// Takes in a string as dayMap symbols delimited by commas (i.e. 'M,T') and
// parses into an array of boolean values representing if the
// day was selected. Each boolean in the array is mapped to its
// corresponding symbol via index (i.e. [ M, T, W, R, F, S, U ])
// so: 'M,T' => [true, true, false, false, false, false, false]

class WeekdaysPickerStore {
  public days?: boolean[];

  constructor() {
    makeObservable(this, {
      days: observable,
      selectDay: action,
      initDays: action,
      fromInput: action,
      toScheduleDays: computed,
      dayName: action
    });
  }

  public fromInput(scheduleDays: string): void {
    const selected: Set<number> = new Set(
      scheduleDays.split(',').map((d) => dayMap[d.toUpperCase()])
    );

    this.initDays(
      [1, 2, 3, 4, 5, 6, 0].map((dayNum: number) => selected.has(dayNum))
    );
  }

  public get toScheduleDays(): string {
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
    const len = (this.days || []).length;
    return Object.keys(dayMap).find((k) => dayMap[k] === (dayIndex + 1) % len);
  }

  public dayName(dayIndex: number): string {
    if (!this.days || !this.days.length || this.days.length <= dayIndex) {
      console.warn(`Unable to resolve name for day: ${dayIndex}`);
      return '';
    }
    return Days.getName(dayIndex);
  }
}

export const WeekdaysPickerState = new WeekdaysPickerStore();
