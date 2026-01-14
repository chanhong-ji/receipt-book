import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

// Jest global scope에서 teardown이 접근할 수 있도록
declare global {
  var __POSTGRES_CONTAINER__: StartedPostgreSqlContainer | undefined;
}

export default async function globalSetup() {
  // 1️⃣ Postgres 컨테이너 생성
  const container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('test_db') // ⚠️ 'postgres' 이름은 피하는 게 안전
    .withUsername('test_user')
    .withPassword('test_password')
    .withReuse() // 로컬에서만 유효(속도 개선)
    .start();

  // 2️⃣ teardown에서 접근할 수 있도록 전역에 보관
  global.__POSTGRES_CONTAINER__ = container;

  // 3️⃣ TypeORM/Nest에서 사용할 환경 변수 주입
  process.env.DATABASE_HOST = container.getHost();
  process.env.DATABASE_PORT = String(container.getPort());
  process.env.DATABASE_USERNAME = container.getUsername();
  process.env.DATABASE_PASSWORD = container.getPassword();
  process.env.DATABASE_NAME = container.getDatabase();

  process.env.NODE_ENV = 'test';

  console.log('🐘 Testcontainers Postgres started');
  console.log({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
  });
}
