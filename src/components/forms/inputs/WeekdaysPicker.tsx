import { observer } from 'mobx-react';
import React from 'react';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { WeekdaysPickerState } from '../../../stores/WeekdaysPickerState';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';

export interface WeekdaysPickerProps {
  value?: string;
  onChange: (days: string) => void;
}

export class WeekdaysPickerComponent extends React.Component<WeekdaysPickerProps> {
  public store: typeof WeekdaysPickerState = WeekdaysPickerState;
  constructor(props: WeekdaysPickerProps) {
    super(props);
  }

  componentDidMount(): void {
    this.store.fromInput(this.props.value || '');
  }

  onChange(dayIndex: number, selected: boolean) {
    this.store.selectDay(dayIndex, !selected);
    this.props.onChange(this.store.toScheduleDays);
  }

  render() {
    return (
      <div className="flex flex-row">
        {this.store.days &&
          this.store.days.length &&
          this.store.days.map((selected: boolean, dayIndex: number) => (
            <div
              key={`weekday-select-option-${dayIndex}`}
              onClick={() => {
                this.onChange(dayIndex, selected);
              }}
              className={
                'border-2 border-inherit rounded mt-5 mr-2 cursor-pointer h-[70px] w-[50px]'
              }
            >
              <div className="border-b-2 text-center select-none text-white bg-accent px-3 py-1 border-solid">
                {this.store.dayName(dayIndex)}
              </div>
              <div className="text-center">
                {selected && (
                  <CustomIcon
                    className="w-8 h-8 ml-auto mr-auto"
                    darkMode={DarkModeState}
                    icon={IconTypes.Checkmark}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export const WeekdaysPicker = observer(WeekdaysPickerComponent);
