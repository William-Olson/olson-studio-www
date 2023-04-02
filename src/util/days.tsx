import moment from 'moment';

export const dayMap: { [k: string]: number } = {
  M: 1,
  T: 2,
  W: 3,
  R: 4,
  F: 5,
  S: 6,
  U: 7
};

export class Days {
  public static expandName(daySymbol: string, full?: boolean) {
    return moment()
      .startOf('week')
      .day(dayMap[daySymbol])
      .format(full ? 'dddd' : 'dd');
  }

  public static getName(dayIndex: number, full?: boolean) {
    return moment()
      .startOf('week')
      .day(dayIndex + 1)
      .format(full ? 'dddd' : 'dd');
  }
}
