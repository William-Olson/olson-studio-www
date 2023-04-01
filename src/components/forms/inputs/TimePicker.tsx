import React, { useRef, useEffect, useCallback } from 'react';
import { TimepickerUI } from 'timepicker-ui';

interface TimePickerProps {
  value: string;
  onChange: (value?: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = (props: TimePickerProps) => {
  const tmRef = useRef(null);

  const changeEventHandler = useCallback((e: CustomEvent) => {
    props.onChange(`${e.detail.hour}:${e.detail.minutes} ${e.detail.type}`);
  }, []);

  useEffect(() => {
    const tm = tmRef.current as unknown as HTMLDivElement;

    const newPicker = new TimepickerUI(tm, {
      theme: 'm3',
      mobile: true,
      enableSwitchIcon: true
    });
    newPicker.create();

    //@typescript-eslint-disable-next-line
    //@ts-ignore
    tm.addEventListener('accept', changeEventHandler);

    return () => {
      //@typescript-eslint-disable-next-line
      //@ts-ignore
      tm.removeEventListener('accept', changeEventHandler);
    };
  }, [changeEventHandler]);

  // const oldClassName = 'timepicker-ui-input py-2 bg-inherit cursor-pointer';
  const className =
    'timepicker-ui-input ' +
    ' border' +
    ' cursor-pointer' +
    ' bg-inherit' +
    ' rounded' +
    ' w-32' +
    ' py-2' +
    ' px-3' +
    ' leading-tight' +
    ' focus:shadow-outline';

  return (
    <div className="timepicker-ui" ref={tmRef}>
      <input type="test" className={className} defaultValue={props.value} />
    </div>
  );
};

export default TimePicker;
