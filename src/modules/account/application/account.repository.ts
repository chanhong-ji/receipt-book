import { Account } from '../domain/entity/account.entity';

export interface AccountRepository {
  findAll(userId: number): Promise<Account[]>;
  save(account: Account, userId: number): Promise<Account>;
}
