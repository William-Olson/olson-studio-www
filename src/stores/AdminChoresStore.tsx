import { PagedResponse, StudioApiChore } from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { ChoreChartService } from '../services/ChoreChartService';
import { Token } from '../util/Auth';

class AdminChartChoresStore {
  public api: ChoreChartService = new ChoreChartService();
  public chartId: string | undefined;
  public isConfirmModalOpen = false;
  public choreToDelete: StudioApiChore | undefined;
  public chores: PagedResponse<StudioApiChore> | undefined;

  constructor() {
    makeObservable(this, {
      chartId: observable,
      chores: observable,
      isConfirmModalOpen: observable,
      choreToDelete: observable,
      openConfirmModal: action,
      fetchChores: action,
      deleteChore: action
    });
  }

  public openConfirmModal(shouldOpen: boolean, chore?: StudioApiChore) {
    this.choreToDelete = chore;
    this.isConfirmModalOpen = shouldOpen;
  }

  public async fetchChores(chartId?: string): Promise<void> {
    this.chartId = chartId;
    const resp = await this.api.getChores(
      Token.fromCache(),
      this.chartId || ''
    );

    runInAction(() => {
      this.chores = resp;
    });
  }

  public async deleteChore(choreId: string): Promise<void> {
    await this.api.deleteChore(Token.fromCache(), this.chartId || '', choreId);
    await this.fetchChores(this.chartId);
  }
}

export const AdminChoresState = new AdminChartChoresStore();
