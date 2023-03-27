import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { AdminChartsState } from '../../../stores/AdminChartsStore';
import moment from 'moment';
import { SimpleLabel } from '../../layout/subcomponents/SimpleLabel';
import _ from 'lodash';
import { AdminGuard } from '../../helpers/AdminGuard';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { getToastTheme, Toast } from '../../../util/Toast';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { emitter } from '../../../Events';

class AdminChartsTableComponent extends React.Component {
  private darkMode: typeof DarkModeState = DarkModeState;
  private userStore: typeof UserState = UserState;
  private adminCharts: typeof AdminChartsState = AdminChartsState;

  public async componentDidMount() {
    emitter.on(['chartsUpdated'], this.handleUpdateEvent);
    await this.adminCharts.fetchAdminCharts();
  }

  public componentWillUnmount(): void {
    emitter.off(['chartsUpdated'], this.handleUpdateEvent);
  }

  private handleUpdateEvent() {
    AdminChartsState.fetchAdminCharts();
  }

  public render(): ReactElement {
    if (!this.userStore.isAdmin) {
      return <AdminGuard isAdmin={this.userStore.isAdmin} />;
    }

    return (
      <>
        <ConfirmModal
          headerText="Delete Chart?"
          isWarning
          open={this.adminCharts.isConfirmModalOpen}
          bodyText="Are you sure you want to delete this chart?"
          data={this.adminCharts.chartToDelete}
          onConfirm={async (c) => {
            await this.adminCharts.deleteChart(c);
            this.adminCharts.openConfirmModal(false);
            Toast.success('Deleted Chart Successfully!', {
              theme: getToastTheme(this.darkMode.isDark)
            });
            await this.adminCharts.fetchAdminCharts();
          }}
          onCancel={() => {
            this.adminCharts.openConfirmModal(false);
          }}
        />
        {!!this.userStore?.user && (
          <div className="pb-20 w-full">
            <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
              <h3 className="text-3xl font-mono pb-6 mt-6">List of Charts</h3>
              {this.adminCharts.activeAdminCharts?.results?.length &&
                _.sortBy(this.adminCharts.activeAdminCharts.results, [
                  'lastActivity'
                ])
                  .reverse()
                  .map((adminChart) => (
                    <SimpleLabel
                      label={moment(adminChart.created).format(
                        'M / D - hh:mm:ss a'
                      )}
                      value={adminChart.name}
                      key={adminChart.id}
                      action={
                        <button
                          className="text-accent"
                          onClick={() =>
                            this.adminCharts.openConfirmModal(true, adminChart)
                          }
                        >
                          Delete
                        </button>
                      }
                    />
                  ))}
            </div>
          </div>
        )}
        {!this.userStore?.user && (
          <>
            <div className="pb-20 w-full">
              <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
                <h3 className="text-3xl font-mono pb-6 mt-6">List of Charts</h3>
                <SimpleLabel label="No Charts Found" />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export const AdminChartsTable = observer(AdminChartsTableComponent);
