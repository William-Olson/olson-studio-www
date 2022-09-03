import axios from 'axios';
import { Token } from '../util/Auth';

const STUDIO_API_BASE_URL =
  import.meta.env.VITE_APP_OS_SERVER_URL ||
  'http://localhost:8888/.netlify/functions/studio-api';

export class StudioApiService {
  /**
   * Retrieves User Information associated to the auth token.
   *
   * @param token Token The authentcated user's auth token
   * @returns Studio API User Information
   */
  public async getUserInfo(token: Token) {
    return (
      await axios.request({
        url: `${STUDIO_API_BASE_URL}/me`,
        method: 'GET',
        headers: {
          Authorization: `bearer ${token}`
        }
      })
    ).data;
  }

  /**
   * Deletes the user session associated to the auth token.
   *
   * @param token Token An authentcated user's auth token
   * @returns object Response containing a success or failure boolean.
   */
  public async deleteCurrentSession(token: Token) {
    const sessionId: string | undefined = token.decode()?.sub;

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

  /**
   * Exchanges the Google Auth code for an Access Token and User Information.
   * After clicking login, completing the Google prompt and redirecting back to
   * our application, our UI receives a temporary authorization code from Google.
   * We then will send the newly aquired auth code to our Studio API for an exchange
   * on the backend since the client secret (for our app) is held there. This method
   * makes that call to our API for the exchange.
   *
   * @param code string The authorization code to use for aquiring the access token
   * @returns Studio API User Information
   */
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
}
