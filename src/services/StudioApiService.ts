import axios from 'axios';
import jwtDecode from 'jwt-decode';

const STUDIO_API_BASE_URL =
  import.meta.env.VITE_APP_OS_SERVER_URL ||
  'http://localhost:8888/.netlify/functions/studio-api';

export class StudioApiService {
  public async exchangeGoogleAuthToken(code: string) {
    return (
      await axios.request({
        url: `${STUDIO_API_BASE_URL}/oauth2/redirect/google`,
        method: 'POST',
        data: {
          code
        }
      })
    ).data;
  }

  public async getUserInfo(token: string) {
    return (
      await axios.request({
        url: `${STUDIO_API_BASE_URL}/me`,
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + token
        }
      })
    ).data;
  }

  public async deleteCurrentSession(token: string) {
    const decoded = jwtDecode<{ sub: string }>(token);
    const sessionId = decoded.sub;

    console.log(`removing old session: ${sessionId}`);
    return (
      await axios.request({
        url: `${STUDIO_API_BASE_URL}/sessions/${sessionId}`,
        method: 'DELETE',
        headers: {
          Authorization: 'bearer ' + token
        }
      })
    ).data;
  }
}
