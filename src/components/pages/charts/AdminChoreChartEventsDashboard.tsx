import { UserState } from '../../../stores/UserStore';
import { Banner } from '../../layout/Banner';
import { Link } from 'react-router-dom';

import { AdminChartEventsState } from '../../../stores/AdminChartEventsStore';
import { MutedSection, mutedColorCss } from '../../helpers/MutedSection';
import { AdminGuard } from '../../helpers/AdminGuard';
import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { AdminChoreEventsArea } from './AdminChoreEventsArea';

interface AdminChoreChartEventsDashboardProps {}

class AdminChoreChartEventsDashboardComponent extends React.Component<AdminChoreChartEventsDashboardProps> {
  public userStore: typeof UserState = UserState;
  public adminChartEvents: typeof AdminChartEventsState = AdminChartEventsState;
  componentDidMount(): void {
    this.adminChartEvents.fetchAdminChartEvents();
    // console.log('fetched: ', this.adminChartEvents.chartEvents);
  }
  render() {
    const bannerIcon: ReactElement = (
      <CustomIcon
        className="w-24 h-24 m-auto"
        color={mutedColorCss}
        darkMode={DarkModeState}
        icon={IconTypes.Approved}
      />
    );

    if (!this.userStore.isAdmin) {
      return <AdminGuard isAdmin={false} />;
    }

    return (
      <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
        <Banner headingText="" subText="Chore Chart Events" logo={bannerIcon} />

        <div className="pb-20 w-full">
          <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
            {/* drag-n-drop area */}
            <AdminChoreEventsArea store={this.adminChartEvents} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {!!this.adminChartEvents?.charts && (
            <MutedSection addClasses="flex-col w-32">
              <h3 className="text-xl font-mono w-32">Due Times</h3>
              <p className="w-32">
                {[
                  // remove duplicate times
                  ...new Set(
                    (this.adminChartEvents.charts?.results || []).map(
                      (c) => c.dueTime
                    )
                  )
                ].map((displayDueTime) => (
                  <span className="p-2" key={`due-times-${displayDueTime}`}>
                    {displayDueTime}
                    <br />
                  </span>
                ))}
              </p>
            </MutedSection>
          )}
        </div>
        <div className="flex justify-center">
          <Link to={`/chore-charts`}>
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
