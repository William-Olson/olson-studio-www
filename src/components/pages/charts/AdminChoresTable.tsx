import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { AdminChoresState } from '../../../stores/AdminChoresStore';
import { SimpleLabel } from '../../layout/subcomponents/SimpleLabel';
import _ from 'lodash';
import { AdminGuard } from '../../helpers/AdminGuard';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { getToastTheme, Toast } from '../../../util/Toast';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { EmptyResults } from './EmptyResults';
import { AdminChartsState } from '../../../stores/AdminChartsStore';
import { Days } from '../../../util/days';

interface AdminChoresTableProps {
  chartId: string;
}

class AdminChoresTableComponent extends React.Component<AdminChoresTableProps> {
  private darkMode: typeof DarkModeState = DarkModeState;
  private userStore: typeof UserState = UserState;
  private chartStore: typeof AdminChartsState = AdminChartsState;
  private store: typeof AdminChoresState = AdminChoresState;

  public async componentDidMount() {
    await this.store.fetchChores(this.props.chartId);
  }

  public componentWillUnmount(): void {
    this.chartStore.viewChart(undefined);
  }

  public render(): ReactElement {
    if (!this.userStore.isAdmin) {
      return <AdminGuard isAdmin={this.userStore.isAdmin} />;
    }

    return (
      <>
        <ConfirmModal
          headerText="Delete Chore?"
          isWarning
          open={this.store.isConfirmModalOpen}
          bodyText="Are you sure you want to delete this Chore?"
          data={this.store.choreToDelete}
          onConfirm={async (c) => {
            await this.store.deleteChore(c.id || '');
            this.store.openConfirmModal(false);
            Toast.success('Deleted Chore Successfully!', {
              theme: getToastTheme(this.darkMode.isDark)
            });
            await this.store.fetchChores(this.props.chartId);
          }}
          onCancel={() => {
            this.store.openConfirmModal(false);
          }}
        />
        {!!this.userStore?.user && (
          <div className="pb-20 w-full">
            <div className="m-5 pl-8 pr-8 pb-9 space-y-6">
              <h3 className="text-3xl font-mono pb-6 mt-6">List of Chores</h3>
              {!!this.store.chores?.results?.length &&
                _.sortBy(this.store.chores.results, ['created'])
                  .reverse()
                  .map((chore) => (
                    <SimpleLabel
                      label={
                        <div>
                          {chore.scheduleDays.split(',').map((d, i) => (
                            <span
                              className={
                                'mr-2 ' +
                                (i % 2 === 0
                                  ? 'text-stone-700'
                                  : 'text-stone-500')
                              }
                            >
                              {Days.expandName(d)}
                            </span>
                          ))}
                        </div>
                      }
                      value={chore.name}
                      key={chore.id}
                      action={
                        <button
                          className="text-accent"
                          onClick={() =>
                            this.store.openConfirmModal(true, chore)
                          }
                        >
                          Delete
                        </button>
                      }
                    />
                  ))}
              {!this.store.chores?.results?.length && (
                <EmptyResults entityName="Chores" />
              )}
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

export const AdminChoresTable = observer(AdminChoresTableComponent);
