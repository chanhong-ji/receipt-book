import { Account } from '../domain/entity/account.entity';

export interface AccountRepository {
  findAll(userId: number): Promise<Account[]>;
}
