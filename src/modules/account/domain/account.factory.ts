import { Injectable } from '@nestjs/common';
import { Account } from './entity/account.entity';
import { FindAccountsUsecase } from './usecases/find-accounts.usecase';

@Injectable()
export class AccountFactory {
  constructor(private readonly findAccountsUsecase: FindAccountsUsecase) {}

  findAccounts(userId: number): Promise<Account[]> {
    return this.findAccountsUsecase.execute(userId);
  }
}
