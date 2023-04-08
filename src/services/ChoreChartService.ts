import axios from 'axios';
import { ChoreChartPayload, ChorePayload } from '../types/ChoreTypes';
import {
  PagedResponse,
  StudioApiChoreChart,
  StudioApiChoreEvent
} from '../types/StudioApiTypes';
import { Token } from '../util/Auth';
import { STUDIO_API_BASE_URL } from './StudioApiService';

export class ChoreChartService {
  /**
   * Creates a new Chore Chart with the specified payload data.
   *
   * @param token Token An authentcated user's auth token
   * @param payload Payload to send to the API endpoint.
   * @returns object Response containing a success or failure boolean.
   */
  public async createChoreChart(token: Token, payload: ChoreChartPayload) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts`,
        method: 'POST',
        data: payload,
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches the Chores for a given Chart via Admin API.
   *
   * @param token Token An authentcated user's auth token.
   * @param chartId ID of the chart to fetch chores from.
   * @returns object Response containing the paginated results.
   */
  public async createChore(token: Token, chartId: string, chore: ChorePayload) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${chartId}/chores`,
        method: 'POST',
        data: chore,
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Deletes the Admin Chore Charts with the given chart ID.
   *
   * @param token Token An authentcated user's auth token
   * @returns object Response containing a success or failure boolean.
   */
  public async deleteAdminChart(token: Token, chartId: string) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${chartId}`,
        method: 'DELETE',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Deletes the Chore with the given chore and chart IDs.
   *
   * @param token Token An authentcated user's auth token
   * @param chartId Chart ID the chore to delete belongs to.
   * @param choreId ID of the chore to delete
   * @returns object Response containing a success or failure boolean.
   */
  public async deleteChore(token: Token, chartId: string, choreId: string) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${chartId}/chores/${choreId}`,
        method: 'DELETE',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches the Admin Chore Charts from the API.
   *
   * @param token Token An authentcated user's auth token
   * @returns object Response containing the paginated results.
   */
  public async getAdminCharts(token: Token) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts`,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches the Admin Chore Chart Events from the API.
   *
   * @param token Token An authentcated user's auth token.
   * @param chartId ID of the chart to fetch events from.
   * @returns object Response containing the paginated results.
   */
  public async getAdminChartEvents(
    token: Token,
    chartId: string
  ): Promise<PagedResponse<StudioApiChoreEvent> | undefined> {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${chartId}/events`,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates the Admin Chore Chart Event via the API.
   *
   * @param token Token An admin's auth token.
   * @param event The event to update.
   * @returns object Response containing success message or undefined.
   */
  public async updateAdminChoreEvent(
    token: Token,
    event: StudioApiChoreEvent
  ): Promise<PagedResponse<StudioApiChoreEvent> | undefined> {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${event.choreChartId}/events/${event.id}`,
        method: 'PATCH',
        data: event,
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Updates the Chore Chart Event via Non-Admin API.
   *
   * @param token Token An authentcated user's auth token.
   * @param event The event to update.
   * @returns object Response containing success message or undefined.
   */
  public async updateChoreEvent(
    token: Token,
    event: StudioApiChoreEvent
  ): Promise<PagedResponse<StudioApiChoreEvent> | undefined> {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/chores`,
        method: 'PATCH',
        data: {
          eventId: event.id,
          status: event.status
        },
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches the Chores for a given Chart via Admin API.
   *
   * @param token Token An authentcated user's auth token.
   * @param chartId ID of the chart to fetch chores from.
   * @returns object Response containing the paginated results.
   */
  public async getChores(token: Token, chartId: string) {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/admin/chore-charts/${chartId}/chores`,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetches the Chore events for the authenticated User.
   *
   * @param token Token An authentcated user's auth token.
   * @returns object Response containing the paginated results.
   */
  public async getUserChoreEvents(
    token: Token
  ): Promise<PagedResponse<StudioApiChoreChart> | undefined> {
    try {
      const resp = await axios.request({
        url: `${STUDIO_API_BASE_URL}/chores`,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token.toString()
        }
      });
      return resp.data;
    } catch (err) {
      console.error(err);
    }
  }
}
