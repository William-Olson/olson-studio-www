import React, { ReactElement, useEffect } from 'react';
import { UserState } from '../../../stores/UserStore';
import { observer } from 'mobx-react';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { Banner } from '../../layout/Banner';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { AdminChoresTable } from './AdminChoresTable';
import { useParams } from 'react-router-dom';

import { AdminChartsState } from '../../../stores/AdminChartsStore';
import { MutedSection, mutedColorCss } from '../../helpers/MutedSection';
import { LinkButton } from '../../helpers/LinkedButton';

interface AdminChartOverviewProps {}

const AdminChartOverviewComponent: React.FC<AdminChartOverviewProps> = () => {
  const userStore: typeof UserState = UserState;
  const adminCharts: typeof AdminChartsState = AdminChartsState;

  const { id } = useParams();

  useEffect(() => {
    adminCharts.findChart(id || '').then((c) => adminCharts.viewChart(c));
  });

  const bannerIcon: ReactElement = (
    <CustomIcon
      className="w-24 h-24 m-auto"
      color={mutedColorCss}
      darkMode={DarkModeState}
      icon={IconTypes.Chart}
    />
  );

  if (!adminCharts.viewingChart) {
    return <></>;
  }

  return (
    <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
      <Banner
        headingText={`${adminCharts.viewingChart.name}`}
        subText="Chart Overview"
        logo={bannerIcon}
      />

      <div className="flex flex-col md:flex-row">
        <MutedSection addClasses="flex-col w-[630px]">
          <h3 className="text-xl font-mono">Description</h3>
          <p className="">{adminCharts.viewingChart.description}</p>
        </MutedSection>
        <MutedSection addClasses="flex-col w-32">
          <h3 className="text-xl font-mono w-32 md:text-right">Due Time</h3>
          <p className="w-32 md:text-right">
            {adminCharts.viewingChart.dueTime}
          </p>
        </MutedSection>
      </div>

      <AdminChoresTable chartId={adminCharts.viewingChart.id} />
      {!!userStore?.user && (
        <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto flex flex-row">
          <LinkButton
            leftIcon={IconTypes.ChevronLeft}
            to={`/admin/chore-charts`}
            label="Back to Charts"
          />
          <span className="flex flex-auto"></span>
          <LinkButton
            rightIcon={IconTypes.Plus}
            to={`/admin/chore-charts/${adminCharts.viewingChart.id}/create-chore`}
            label="Add New Chore"
          />
        </div>
      )}
    </div>
  );
};

export const AdminChartOverview = observer(AdminChartOverviewComponent);
