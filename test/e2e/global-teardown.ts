import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default async function () {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
    });

    console.log('🧹 테스트 데이터베이스 정리 중...');
    await dataSource.initialize();

    const tables = [
      'agent_advice_request',
      'agent_advice',
      'expense',
      'budget',
      'category',
      'account',
      'merchant',
      'user',
    ];

    // 각 테이블의 데이터를 삭제 (스키마는 유지)
    for (const table of tables) {
      await dataSource.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    }

    console.log('✅ 테스트 데이터베이스 정리 완료');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ 테스트 데이터베이스 정리 중 오류:', error);
  }
}
