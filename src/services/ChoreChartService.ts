import axios from 'axios';
import { ChoreChartPayload } from '../types/ChoreTypes';
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
      resp.data;
    } catch (err) {
      throw err;
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
      throw err;
    }
  }

  /**
   * Deletes the Admin Chore Charts with the given chart ID.
   *
   * @param token Token An authentcated user's auth token
   * @returns object Response containing a success or failure boolean.
   */
  public async deleteAdminChart(chartId: string, token: Token) {
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
      throw err;
    }
  }
}
