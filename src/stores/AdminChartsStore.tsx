import {
  StudioApiAdminChart,
  StudioApiAdminCharts
} from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { ChoreChartService } from '../services/ChoreChartService';
import { Token } from '../util/Auth';

class AdminChartsStore {
  public activeAdminCharts?: StudioApiAdminCharts;
  public api: ChoreChartService = new ChoreChartService();

  constructor() {
    makeObservable(this, {
      activeAdminCharts: observable,
      isConfirmModalOpen: observable,
      chartToDelete: observable,
      openConfirmModal: action,
      fetchAdminCharts: action,
      deleteChart: action
    });
  }

  public isConfirmModalOpen = false;
  public chartToDelete: StudioApiAdminChart | undefined;

  public openConfirmModal(shouldOpen: boolean, chart?: StudioApiAdminChart) {
    this.chartToDelete = chart;
    this.isConfirmModalOpen = shouldOpen;
  }

  public async fetchAdminCharts(): Promise<void> {
    const resp = await this.api.getAdminCharts(Token.fromCache());

    runInAction(() => {
      this.activeAdminCharts = resp;
    });
  }

  public async deleteChart(adminChart: StudioApiAdminChart): Promise<void> {
    await this.api.deleteAdminChart(adminChart.id || '', Token.fromCache());
    await this.fetchAdminCharts();
  }
}

export const AdminChartsState = new AdminChartsStore();
