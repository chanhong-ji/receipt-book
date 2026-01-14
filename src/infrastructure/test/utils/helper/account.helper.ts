import { AccountModel } from 'src/infrastructure/typeorm/models/account.model';
import { AccountType } from 'src/modules/user/domain/enum/account.enum';
import { DataSource } from 'typeorm';

type CreateTestAccountParams = Partial<Pick<AccountModel, 'name' | 'type'>>;

export async function createTestAccount(
  dataSource: DataSource,
  userId: number,
  params: CreateTestAccountParams = {},
): Promise<number> {
  const now = new Date().toISOString();

  const account = await dataSource.getRepository(AccountModel).save({
    name: params.name ?? `test_${now}`,
    type: params.type ?? AccountType.CARD,
    user: { id: userId },
  });

  return account.id;
}
