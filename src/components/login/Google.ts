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

export function getGoogleLoginUrl(): string {
  const params: URLSearchParams = new URLSearchParams();
  params.set('client_id', config.web.clientId);
  params.set('response_type', 'code');
  params.set('scope', 'email openid profile');
  params.set('prompt', 'consent');
  console.log('nodeEnv: ', process.env.NODE_ENV);
  console.log('imp.nodeEnv: ', import.meta.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'production') {
    params.set('redirect_uri', 'http://localhost:3000/oauth2/redirect/google');
  } else {
    params.set('redirect_uri', config.web.redirectUri);
  }
  params.set('include_granted_scopes', 'true');
  return (
    'https://accounts.google.com/o/oauth2/v2/auth' + '?' + params.toString()
  );
}
