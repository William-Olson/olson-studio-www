// import axios from 'axios';

const config = {
  web: {
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    clientId:
      import.meta.env.VITE_APP_OS_GOOGLE_OAUTH_CLIENT_ID ||
      '<Replace via VITE_APP_OS_GOOGLE_OAUTH_CLIENT_ID environment variable>',
    redirectUri:
      import.meta.env.VITE_APP_OS_GOOGLE_OAUTH_REDIRECT_URI ||
      'http://localhost:3000/oauth2/redirect/google'
  }
};

// export interface GoogleAuthToken {
//   accessToken: string;
//   refreshToken: string;
//   expiresAt: number;
// }

// export interface GoogleUser {
//   googleId: string;
//   auth: GoogleAuthToken;
//   email: string;
//   name: string;
//   firstName: string;
//   lastName: string;
//   picture?: string;
// }

export function getGoogleLoginUrl(): string {
  const params: URLSearchParams = new URLSearchParams();
  params.set('client_id', config.web.clientId);
  params.set('response_type', 'code');
  params.set('scope', 'email openid profile');
  params.set('prompt', 'consent');
  params.set('redirect_uri', config.web.redirectUri);
  params.set('include_granted_scopes', 'true');
  return (
    'https://accounts.google.com/o/oauth2/v2/auth' + '?' + params.toString()
  );
}

// export async function sendToServerToExchangeAuthCodeForToken(code: string) {
//   return (
//     await axios.request({
//       method: 'POST',
//       url: 'http://localhost:8888/.netlify/functions/olson-studio/oauth2/redirect/google',
//       data: JSON.stringify({ code })
//     })
//   ).data;
// }

// export async function login(callback: (data: GoogleUser) => void) {
//   const authUrl = getGoogleLoginUrl();
//   const authWindow: Window | null = window.open(
//     authUrl,
//     authUrl,
//     'toolbar=no, location=no, directories=no, status=no, menubar=no, ' +
//       'scrollbars=no, resizable=no, width=800, height=600'
//   );

//   if (!authWindow) {
//     return;
//   }

//   const onAuthWindowClosed = async (event: any, url: string) => {
//     const urlObject = new URL(url);
//     const queryParams = new URLSearchParams(urlObject.search);

//     if (queryParams.has('code') || queryParams.has('error')) {
//       // close window momentarily
//       setTimeout(() => {
//         if (authWindow) authWindow.close();
//       }, 800);
//     }

//     if (queryParams.has('code')) {
//       return await sendToServerToExchangeAuthCodeForToken(
//         queryParams.get('code') || ''
//       );
//     }
//   };

//   const authInterval = authWindow.setInterval(function () {
//     if (authWindow.closed) {
//       window.clearInterval(authInterval);
//       onAuthWindowClosed(authWindow, authWindow.location.href).then((data) =>
//         callback(data)
//       );
//     }
//   }, 1000);

//   authWindow.location.replace(authUrl);
// }
