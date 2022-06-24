import axios from 'axios';

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
}
