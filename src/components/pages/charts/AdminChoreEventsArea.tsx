import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { AdminChartEventsState } from '../../../stores/AdminChartEventsStore';
import {
  DragDropContext,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  DroppableProvided,
  NotDraggingStyle,
  Droppable
} from 'react-beautiful-dnd';
import {
  ChoreEventStatus,
  StudioApiChartEvent
} from '../../../types/StudioApiTypes';

// helper functions ------------------------------------------------

const grid = 8;

const getItemStyle = (
  draggableStyle?: DraggingStyle | NotDraggingStyle,
  isDragging?: boolean
): CSSProperties => ({
  // basic styles
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background color if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

// -----------------------------------------------------------------
// -----------------------------------------------------------------

interface DropColumnProps {
  data: Array<StudioApiChartEvent>;
  dropId: string;
}
const DropColumnComponent: React.FC<DropColumnProps> = (
  props: DropColumnProps
) => {
  if (!props.data || !props.data.length) {
    return null;
  }
  return (
    <>
      <Droppable droppableId={props.dropId}>
        {(providedDroppable: DroppableProvided, snapshot) => (
          <div
            ref={providedDroppable.innerRef}
            key={`${props.dropId}-droppable-area`}
            style={getListStyle(snapshot.isDraggingOver)}
            {...providedDroppable.droppableProps}
          >
            {!!props.data &&
              !!props.data?.length &&
              props.data.map((item, index: number) => (
                <Draggable
                  key={`${props.dropId}-drg-${item.id || index}`}
                  draggableId={`${props.dropId}-drg-id-${item.id || index}`}
                  index={index}
                >
                  {(
                    providedDraggable: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                  ) => (
                    <div>
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.dragHandleProps}
                        {...providedDraggable.draggableProps}
                        style={getItemStyle(
                          providedDraggable.draggableProps.style,
                          snapshot.isDragging
                        )}
                      >
                        {item.status}
                      </div>
                      {
                        (providedDraggable as Partial<DroppableProvided>)
                          .placeholder
                      }
                    </div>
                  )}
                </Draggable>
              ))}
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
};

export const DropColumn = observer(DropColumnComponent);

// -----------------------------------------------------------------
// -----------------------------------------------------------------

interface AdminChoreEventsAreaProps {
  store: typeof AdminChartEventsState;
}

export class AdminChoreEventsAreaComponent extends React.Component<AdminChoreEventsAreaProps> {
  constructor(props: AdminChoreEventsAreaProps) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
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
        result.source.droppableId
      );
      return;
    }

    switch (result.destination.droppableId) {
      case ChoreEventStatus.TODO:
        this.props.store.markStatus(ev, ChoreEventStatus.TODO);
        break;
      case ChoreEventStatus.NEEDS_CHECK:
        this.props.store.markStatus(ev, ChoreEventStatus.NEEDS_CHECK);
        break;
      case ChoreEventStatus.COMPLETED:
        this.props.store.markStatus(ev, ChoreEventStatus.COMPLETED);
        break;
    }

    console.log('source: ', result.source);
    console.log('dest: ', result.destination);
    console.log('result: ', result);

    this.props.store.reorder();
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="flex flex-row">
          {!!this.props.store.eventsInTodo && (
            <DropColumn
              data={this.props.store.eventsInTodo || []}
              dropId={ChoreEventStatus.TODO}
            />
          )}
          {!!this.props.store.eventsInNeedsCheck && (
            <DropColumn
              data={this.props.store.eventsInNeedsCheck || []}
              dropId={ChoreEventStatus.NEEDS_CHECK}
            />
          )}
          {!!this.props.store.eventsInDone && (
            <DropColumn
              data={this.props.store.eventsInDone || []}
              dropId={ChoreEventStatus.COMPLETED}
            />
          )}
        </div>
      </DragDropContext>
    );
  }
}

export const AdminChoreEventsArea = observer(AdminChoreEventsAreaComponent);
