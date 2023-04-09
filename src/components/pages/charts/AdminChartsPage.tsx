import React, { ReactElement } from 'react';
import { UserState } from '../../../stores/UserStore';
import { observer } from 'mobx-react';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { Banner } from '../../layout/Banner';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { AdminChartsTable } from './AdminChartsTable';
import { LinkButton } from '../../helpers/LinkedButton';

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
            <LinkButton
              to={`/admin/chore-chart-events`}
              leftIcon={IconTypes.RectangleGroup}
              label="Events Dashboard"
            />
            <span className="flex flex-auto"></span>
            <LinkButton
              to="/admin/create-chore-chart"
              rightIcon={IconTypes.Plus}
              label="Add New Chart"
            />
          </div>
        )}
      </div>
    );
  }
}

export const AdminCharts = observer(AdminChartsComponent);
