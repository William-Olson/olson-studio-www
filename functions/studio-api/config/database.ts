const env = (str: string) => process.env[str] || undefined;

export default {
  dev: {
    host: 'localhost',
    username: 'dev',
    password: 'dev',
    database: 'dev',
    port: 5432
  },
  prod: {
    url: env('OS_DB_CONNECTION_URL')
  }
};
