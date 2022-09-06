import { ReactElement } from 'react';

export interface LabelProps {
  label: string | ReactElement;
  value: string | ReactElement;
  action?: string | ReactElement;
}

export function SimpleLabel(props: LabelProps): ReactElement {
  return (
    <div className="flex-container">
      <div className="flex flex-row">
        <div className="flex-col w-44">{props.label}</div>
        <div className="flex-col text-center flex-grow">{props.value}</div>
        {props.action && (
          <div className="pl-2 flex-col text-right w-28">{props.action}</div>
        )}
      </div>
    </div>
  );
}
