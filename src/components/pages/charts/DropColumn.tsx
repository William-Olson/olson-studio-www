import { observer } from 'mobx-react';
import { CSSProperties } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  DroppableProvided,
  NotDraggingStyle
} from 'react-beautiful-dnd';
import { AdminChoreEventsState } from '../../../stores/AdminChoreEventsStore';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { UserChoreEventsState } from '../../../stores/UserChoreEventsStore';
import { UserState } from '../../../stores/UserStore';
import {
  ChoreEventStatus,
  StudioApiChoreEvent
} from '../../../types/StudioApiTypes';
import { Loading } from '../../helpers/Loading';
import { mutedColorCss } from '../../helpers/MutedSection';
import { ChoreEventCard } from './ChoreEventCard';

// helper functions ------------------------------------------------
const grid = 8;

// style the droppable area list during an action
const provideListStyleFetcher = (isDark: boolean, id: string) => {
  const getListStyle = (isDraggingOver: boolean): CSSProperties => ({
    background:
      id === ChoreEventStatus.NEEDS_CHECK
        ? mutedColorCss
        : isDraggingOver
        ? isDark
          ? 'black'
          : 'white'
        : isDark
        ? '#1A0609'
        : '#DBD9D4',
    opacity: isDraggingOver ? 0.6 : 1,
    // border: 'solid 1px ' + mutedColorCss,
    padding: grid,
    marginTop: '-24px',
    minHeight: 'calc(100vh - 250px)',
    minWidth: 270,
    maxWidth: '380px',
    // flex: '1 0 auto',
    width: '50%'
  });

  return getListStyle;
};

// style the draggable items during an action
const provideItemStyleFetcher = (isDark: boolean, id: string) => {
  const getItemStyle = (
    draggableStyle?: DraggingStyle | NotDraggingStyle,
    isDragging?: boolean
  ): CSSProperties => ({
    // basic styles
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    color: isDragging ? '#1A0609' : isDark ? '#DBD9D4' : '#1A0609',

    // change background color if dragging
    border:
      'solid ' +
      (id === ChoreEventStatus.NEEDS_CHECK
        ? '2px goldenrod'
        : isDark
        ? '1px #DBD9D4'
        : '1px #1A0609'),
    borderRadius: '4px',
    background: isDragging
      ? 'rgb(240 237 227)'
      : isDark
      ? '#1A0609'
      : '#DBD9D4',

    // styles we need to apply on draggables
    ...draggableStyle
  });
  return getItemStyle;
};

// -----------------------------------------------------------------

interface DropColumnProps {
  data: Array<StudioApiChoreEvent>;
  dropId: string;
  store: typeof AdminChoreEventsState | typeof UserChoreEventsState;
  user?: typeof UserState;
}
const DropColumnComponent: React.FC<DropColumnProps> = (
  props: DropColumnProps
) => {
  const getListStyle = provideListStyleFetcher(
    DarkModeState.isDark,
    props.dropId
  );
  const getItemStyle = provideItemStyleFetcher(
    DarkModeState.isDark,
    props.dropId
  );

  const listStyles = getListStyle(false);
  if (props.store.loading) {
    return (
      <div style={listStyles}>
        <Loading heightClass="h-[180px]" />
      </div>
    );
  }

  // show the empty column when there are no items to display in it
  if (!props.data || !props.data.length) {
    return (
      <Droppable droppableId={props.dropId}>
        {(providedDroppable: DroppableProvided, snapshot) => (
          <div
            ref={providedDroppable.innerRef}
            key={`${props.dropId}-droppable-area`}
            style={getListStyle(snapshot.isDraggingOver)}
            {...providedDroppable.droppableProps}
          >
            {providedDroppable.placeholder}
          </div>
        )}
      </Droppable>
    );
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
                  ) => {
                    const chart = props.store.getEventChart(item);
                    const chore = props.store.getEventChore(item, chart);

                    return (
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
                          {!!chart && !!chore && (
                            <ChoreEventCard
                              user={props.user}
                              chore={chore}
                              chart={chart}
                              eventData={item}
                            />
                          )}
                        </div>
                      </div>
                    );
                  }}
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
