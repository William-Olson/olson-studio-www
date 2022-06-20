export default {
  web: {
    client_id:
      process.env['OS_GOOGLE_OAUTH_CLIENT_ID'] ||
      '<Replace via OS_GOOGLE_OAUTH_CLIENT_ID environment variable>',
    client_secret:
      process.env['OS_GOOGLE_OAUTH_CLIENT_SECRET'] ||
      '<Replace via OS_GOOGLE_OAUTH_CLIENT_SECRET environment variable>',
    project_id: 'olson-studio',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    redirect_uris: ['https://olson.studio/oauth2/redirect/google']
  }
};
