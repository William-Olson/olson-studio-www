import {
  StudioApiChoreChart,
  StudioApiAdminCharts
} from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { ChoreChartService } from '../services/ChoreChartService';
import { Token } from '../util/Auth';

class AdminChartsStore {
  public activeAdminCharts?: StudioApiAdminCharts;
  public api: ChoreChartService = new ChoreChartService();
  public viewingChart?: StudioApiChoreChart;

  constructor() {
    makeObservable(this, {
      activeAdminCharts: observable,
      isConfirmModalOpen: observable,
      chartToDelete: observable,
      viewingChart: observable,
      viewChart: action,
      openConfirmModal: action,
      fetchAdminCharts: action,
      findChart: action,
      deleteChart: action
    });
  }

  public isConfirmModalOpen = false;
  public chartToDelete: StudioApiChoreChart | undefined;

  public viewChart(chart: StudioApiChoreChart | undefined) {
    this.viewingChart = chart;
  }

  public openConfirmModal(shouldOpen: boolean, chart?: StudioApiChoreChart) {
    this.chartToDelete = chart;
    this.isConfirmModalOpen = shouldOpen;
  }

  public async fetchAdminCharts(): Promise<void> {
    const resp = await this.api.getAdminCharts(Token.fromCache());

    runInAction(() => {
      this.activeAdminCharts = resp;
    });
  }

  public async deleteChart(adminChart: StudioApiChoreChart): Promise<void> {
    await this.api.deleteAdminChart(Token.fromCache(), adminChart.id || '');
    await this.fetchAdminCharts();
  }

  public async findChart(
    chartId: string
  ): Promise<StudioApiChoreChart | undefined> {
    if (!this.activeAdminCharts) {
      await this.fetchAdminCharts();
    }

    return this.activeAdminCharts?.results?.find((c) => c.id === chartId);
  }
}

export const AdminChartsState = new AdminChartsStore();
