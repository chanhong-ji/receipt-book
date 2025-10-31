export default () => ({
  port: process.env.PORT,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  auth: {
    bcrypt: {
      salt: Number(process.env.BCRYPT_SALT ?? 10),
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1D',
    },
    cookie: {
      name: process.env.COOKIE_NAME ?? 'auth_token',
      expiresIn: Number(process.env.COOKIE_EXPIRES_IN ?? 1000 * 60 * 60 * 24),
    },
  },
});
