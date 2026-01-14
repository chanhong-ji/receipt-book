import { DataSource } from 'typeorm';
import { UserModel } from 'src/infrastructure/typeorm/models/user.model';

type CreateTestUserParams = Partial<Pick<UserModel, 'email' | 'name' | 'password'>>;

export async function createTestUser(dataSource: DataSource, params: CreateTestUserParams = {}): Promise<number> {
  const now = new Date().toISOString();

  const user = await dataSource.getRepository(UserModel).save({
    email: params.email ?? `test_${now}@test.com`,
    name: params.name ?? 'test',
    password: params.password ?? 'password',
  });

  return user.id;
}
