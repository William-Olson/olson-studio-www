import { UserState } from '../../../stores/UserStore';
import { Link } from 'react-router-dom';

import { AdminChartEventsState } from '../../../stores/AdminChartEventsStore';
import { MutedSection } from '../../helpers/MutedSection';
import { AdminGuard } from '../../helpers/AdminGuard';
import React from 'react';
import { observer } from 'mobx-react';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { ChoreEventsArea } from './ChoreEventsArea';
import moment from 'moment';

interface AdminChoreChartEventsDashboardProps {}

class AdminChoreChartEventsDashboardComponent extends React.Component<AdminChoreChartEventsDashboardProps> {
  public userStore: typeof UserState = UserState;
  public adminChartEvents: typeof AdminChartEventsState = AdminChartEventsState;
  public darkMode: typeof DarkModeState = DarkModeState;

  componentDidMount(): void {
    this.adminChartEvents.fetchEvents();
  }

  refresh() {
    this.adminChartEvents.fetchEvents();
  }

  render() {
    if (!this.userStore.isAdmin) {
      return <AdminGuard isAdmin={false} />;
    }

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
              store={this.adminChartEvents}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {!!this.adminChartEvents?.charts && (
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
        <div className="flex justify-center">
          <Link to={`/admin/chore-charts`}>
            <button className="border-2 flex flex-row border-inherit rounded py-1 px-3 mr-9">
              <span className="flex flex-col">
                <CustomIcon
                  darkMode={DarkModeState}
                  icon={IconTypes.ChevronLeft}
                />
              </span>
              <span className="flex flex-col"> Back to Charts</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export const AdminChoreChartEventsDashboard = observer(
  AdminChoreChartEventsDashboardComponent
);
