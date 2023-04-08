import { observer } from 'mobx-react';
import React from 'react';
import { AdminChartEventsState } from '../../../stores/AdminChartEventsStore';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { ChoreEventStatus } from '../../../types/StudioApiTypes';
import { DropColumn } from './DropColumn';
import { UserState } from '../../../stores/UserStore';
import { UserChoreEventsState } from '../../../stores/UserChoreEventsStore';
import { getToastTheme, Toast } from '../../../util/Toast';
import { DarkModeState } from '../../../stores/DarkModeStore';

// -----------------------------------------------------------------
// -----------------------------------------------------------------

interface ChoreEventsAreaProps {
  store: typeof AdminChartEventsState | typeof UserChoreEventsState;
  labelColumnOne?: string;
  labelColumnTwo?: string;
  labelColumnThree?: string;
  user?: typeof UserState;
}

export class ChoreEventsAreaComponent extends React.Component<ChoreEventsAreaProps> {
  public darkMode: typeof DarkModeState = DarkModeState;

  constructor(props: ChoreEventsAreaProps) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  public onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const ev = this.props.store.getEventAtIndex(
      result.source.index,
      result.source.droppableId as ChoreEventStatus
    );

    if (!ev) {
      console.warn(
        'unable to find event at index: ' + result.source.index,
        ` (${result.source.droppableId})`
      );
      return;
    }

    const isAdmin = !!this.props.user?.isAdmin;
    const availableStatuses: Set<ChoreEventStatus> = new Set<ChoreEventStatus>([
      ChoreEventStatus.COMPLETED,
      ChoreEventStatus.NEEDS_CHECK,
      ChoreEventStatus.TODO
    ]);
    const targetStatus = result.destination.droppableId as ChoreEventStatus;
    if (!availableStatuses.has(targetStatus)) {
      console.warn('Unable to set status ' + targetStatus);
      return;
    }
    this.props.store
      .markStatus(ev, targetStatus, isAdmin)
      .then(() => {
        const fromIndex = result.source.index;
        const toIndex = result.destination?.index || 0;
        const fromStatus = result.source.droppableId as ChoreEventStatus;

        this.props.store.reorder(fromStatus, fromIndex, targetStatus, toIndex);

        if (fromStatus !== targetStatus) {
          Toast.success('Chore Status Updated!', {
            theme: getToastTheme(this.darkMode.isDark)
          });
        }
      })
      .catch((err) => {
        Toast.error('An error occurred updated chore!', {
          theme: getToastTheme(this.darkMode.isDark)
        });
        console.error('Error: ', err);
      });
  }

  public render() {
    const hasApprovalPermissions =
      !!this.props.user && !!this.props.user.isAdmin;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="flex flex-row mb-0 p-0 w-full">
          <span className="flex text-xl h-23 p-4 border-8 rounded-tl rounded-bl border-stone-700 m-0 min-w-[270px] text-center flex-col flex-auto">
            {this.props.labelColumnOne || 'Todo'}
          </span>
          <span className="flex text-xl h-23 p-4 border-8 border-stone-700 m-0 min-w-[270px] text-center flex-col flex-auto">
            {this.props.labelColumnTwo || 'Pending'}
          </span>
          {hasApprovalPermissions && (
            <span className="flex text-xl h-23 p-4 border-8 rounded-tr rounded-br border-stone-700 m-0 min-w-[270px] text-center flex-col flex-auto">
              {this.props.labelColumnThree || 'Approved'}
            </span>
          )}
        </div>
        <div className="flex flex-row mt-0">
          <DropColumn
            user={this.props.user}
            store={this.props.store}
            data={this.props.store.eventsInTodo || []}
            dropId={ChoreEventStatus.TODO}
          />
          <DropColumn
            user={this.props.user}
            store={this.props.store}
            data={this.props.store.eventsInNeedsCheck || []}
            dropId={ChoreEventStatus.NEEDS_CHECK}
          />
          {hasApprovalPermissions && (
            <DropColumn
              user={this.props.user}
              store={this.props.store}
              data={this.props.store.eventsInDone || []}
              dropId={ChoreEventStatus.COMPLETED}
            />
          )}
        </div>
      </DragDropContext>
    );
  }
}

export const ChoreEventsArea = observer(ChoreEventsAreaComponent);
