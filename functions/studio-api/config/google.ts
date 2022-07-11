export default {
  server: {
    clientId:
      process.env['OS_GOOGLE_OAUTH_CLIENT_ID'] ||
      '<Replace via OS_GOOGLE_OAUTH_CLIENT_ID environment variable>',
    clientSecret:
      process.env['OS_GOOGLE_OAUTH_CLIENT_SECRET'] ||
      '<Replace via OS_GOOGLE_OAUTH_CLIENT_SECRET environment variable>',
    projectId: 'olson-studio',
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    redirectUri:
      process.env['OS_GOOGLE_OAUTH_REDIRECT_URI'] ||
      'http://localhost:3000/oauth2/redirect/google'
  }
};
