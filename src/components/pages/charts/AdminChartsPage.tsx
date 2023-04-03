import React, { ReactElement } from 'react';
import { UserState } from '../../../stores/UserStore';
import { observer } from 'mobx-react';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { Banner } from '../../layout/Banner';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { AdminChartsTable } from './AdminChartsTable';
import { Link } from 'react-router-dom';

class AdminChartsComponent extends React.Component {
  private userStore: typeof UserState = UserState;

  public render() {
    const icon: ReactElement = (
      <CustomIcon
        className="w-24 h-24 m-auto"
        darkMode={DarkModeState}
        icon={IconTypes.Chart}
      />
    );

    return (
      <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
        <Banner headingText="Chore Charts" subText="Admin Panel" logo={icon} />
        <AdminChartsTable />
        {!!this.userStore?.user && (
          <div className="p-9 flex flex-row justify-center text-center auto-cols-max max-w-[650px] m-auto">
            <Link to={`/chore-chart-events`}>
              <button className="border-2 flex flex-row border-inherit rounded py-1 px-3">
                <span className="flex flex-col mr-2">
                  <CustomIcon
                    darkMode={DarkModeState}
                    icon={IconTypes.RectangleGroup}
                  />
                </span>
                <span className="flex flex-col">Events Dashboard</span>
              </button>
            </Link>
            <span className="flex flex-auto"></span>
            <Link to="/create-chore-chart">
              <button className="border-2 flex flex-row border-inherit rounded py-1 px-3">
                <span className="flex flex-col">Add New Chart</span>
                <span className="flex flex-col ml-2">
                  <CustomIcon darkMode={DarkModeState} icon={IconTypes.Plus} />
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export const AdminCharts = observer(AdminChartsComponent);
