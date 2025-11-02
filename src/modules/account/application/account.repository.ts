import { Account } from '../domain/entity/account.entity';

export interface AccountRepository {
  findAll(userId: number): Promise<Account[]>;
  findById(id: number, userId: number): Promise<Account | null>;
  update(account: Account): Promise<Account>;
  save(account: Account, userId: number): Promise<Account>;
  delete(id: number): Promise<void>;
}
