import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { UserState } from '../../../stores/UserStore';
import { IconTypes } from '../../../types/AppTypes';
import {
  ChoreEventStatus,
  StudioApiChoreChart,
  StudioApiChore,
  StudioApiChoreEvent
} from '../../../types/StudioApiTypes';
import { CustomIcon } from '../../CustomIcon';
import { mutedColorClass } from '../../helpers/MutedSection';

interface ChoreEventCardProps {
  chore: StudioApiChore;
  chart: StudioApiChoreChart;
  eventData: StudioApiChoreEvent;
  user?: typeof UserState;
}

export class ChoreEventCardComponent extends React.Component<ChoreEventCardProps> {
  private darkMode = DarkModeState;
  render() {
    const hasActionPermissions = !!this.props.user && !!this.props.user.isAdmin;
    return (
      <div className="flex flex-col h-32 w-[220px]">
        <span className="flex flex-row">
          <CustomIcon darkMode={this.darkMode} icon={IconTypes.Bars2} />
          <span className="flex flex-col flex-auto"></span>
          {this.props.eventData.status === ChoreEventStatus.COMPLETED && (
            <span className={`flex flex-row m-0 h-2 ${mutedColorClass}`}>
              <small className="mr-2 mb-2 mt-1">Approved: </small>
              <CustomIcon
                className="w-4 h-4 mt-1 mb-0"
                darkMode={this.darkMode}
                icon={IconTypes.Approved}
              />
            </span>
          )}
        </span>

        <span className="overflow-x-clip mt-2">
          {`[${this.props.chart.name[0]}-${this.props.chore.id}] `}
          <span className="font-semibold">{this.props.chore.name}</span>
        </span>
        <small>
          <span className="font-semibold">Chart:</span> {this.props.chart.name}
        </small>
        <small>
          <span className="font-semibold">Due:</span>{' '}
          {moment(this.props.eventData.due).format('MM/DD - h:mm A')}
        </small>

        {hasActionPermissions && (
          <div className="flex flex-row border-t border-stone-700 mt-2 mb-0 pt-2">
            <small className="flex flex-col opacity-75 hover:opacity-100 mr-2 cursor-pointer">
              <CustomIcon darkMode={this.darkMode} icon={IconTypes.Eye} />
            </small>
            <small className="flex flex-col opacity-75 hover:opacity-100 cursor-pointer">
              <CustomIcon darkMode={this.darkMode} icon={IconTypes.Edit} />
            </small>
          </div>
        )}
      </div>
    );
  }
}

export const ChoreEventCard = observer(ChoreEventCardComponent);
