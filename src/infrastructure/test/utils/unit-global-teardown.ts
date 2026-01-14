import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  var __POSTGRES_CONTAINER__: StartedPostgreSqlContainer | undefined;
}

export default async function globalTeardown() {
  const container = global.__POSTGRES_CONTAINER__;

  if (!container) {
    return;
  }

  await container.stop();
  global.__POSTGRES_CONTAINER__ = undefined;

  delete process.env.TEST_DB_TYPE;
  delete process.env.DATABASE_HOST;
  delete process.env.DATABASE_PORT;
  delete process.env.DATABASE_USERNAME;
  delete process.env.DATABASE_PASSWORD;
  delete process.env.DATABASE_NAME;

  console.log('🐘 Testcontainers Postgres stopped');
}
