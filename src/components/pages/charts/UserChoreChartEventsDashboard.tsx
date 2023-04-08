import { UserState } from '../../../stores/UserStore';

import { UserChoreEventsState } from '../../../stores/UserChoreEventsStore';
import { MutedSection } from '../../helpers/MutedSection';
import React from 'react';
import { observer } from 'mobx-react';

import { ChoreEventsArea } from './ChoreEventsArea';
import moment from 'moment';
import { CustomIcon } from '../../CustomIcon';
import { IconTypes } from '../../../types/AppTypes';
import { DarkModeState } from '../../../stores/DarkModeStore';

interface UserChoreChartEventsDashboardProps {}

class UserChoreChartEventsDashboardComponent extends React.Component<UserChoreChartEventsDashboardProps> {
  public userStore: typeof UserState = UserState;
  public userChoreEvents: typeof UserChoreEventsState = UserChoreEventsState;
  public darkMode: typeof DarkModeState = DarkModeState;

  componentDidMount(): void {
    this.userChoreEvents.fetchEvents();
  }

  refresh() {
    this.userChoreEvents.fetchEvents();
  }

  render() {
    return (
      <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
        {/* <Banner headingText="" subText="Chore Chart Events" logo={bannerIcon} /> */}
        <div
          className="flex flex-row clickable select-none"
          onClick={() => this.refresh()}
        >
          <CustomIcon darkMode={this.darkMode} icon={IconTypes.Refresh} />
          {/* <span className="mx-2">refresh</span> */}
        </div>

        <div className="pb-20 w-full">
          <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
            {/* drag-n-drop area */}
            <ChoreEventsArea
              user={this.userStore}
              store={this.userChoreEvents}
              labelColumnTwo={'Complete'}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {!!this.userChoreEvents?.charts && (
            <MutedSection addClasses="flex-col w-48">
              <h3 className="text-xl font-mono w-48">Chore Events Board</h3>
              <p className="w-48">
                Displays chore events for today.
                <br />
                {moment().format('MM/DD/YYYY')}
              </p>
            </MutedSection>
          )}
        </div>
      </div>
    );
  }
}

export const UserChoreChartEventsDashboard = observer(
  UserChoreChartEventsDashboardComponent
);
