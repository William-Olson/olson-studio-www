const env = (str: string) =>
  process.env[str] || `<Replace via ${str} environment variable>`;

export default {
  dev: {
    host: 'localhost',
    username: 'dev',
    password: 'dev',
    database: 'dev',
    port: 5432
  },
  prod: {
    host: env('DB_HOST'),
    username: env('DB_USER'),
    password: env('DB_PASSWD'),
    database: env('DB_NAME'),
    port: Number(env('DB_PORT'))
  }
};
