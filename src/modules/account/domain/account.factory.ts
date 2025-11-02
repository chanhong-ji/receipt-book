import { Injectable } from '@nestjs/common';
import { Account } from './entity/account.entity';
import { ICreateAccountInput } from '../application/dtos/create-account.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { FindAccountsUsecase } from './usecases/find-accounts.usecase';
import { CreateAccountUsecase } from './usecases/create-accounts.usecase';
import { IUpdateAccountInput } from '../application/dtos/update-account.dto';
import { UpdateAccountUsecase } from './usecases/update-account.usecase';
import { IDeleteAccountInput } from '../application/dtos/delete-account.dto';
import { DeleteAccountUsecase } from './usecases/delete-account.usecase';

@Injectable()
export class AccountFactory {
  constructor(
    private readonly findAccountsUsecase: FindAccountsUsecase,
    private readonly createAccountUsecase: CreateAccountUsecase,
    private readonly updateAccountUsecase: UpdateAccountUsecase,
    private readonly deleteAccountUsecase: DeleteAccountUsecase,
  ) {}

  findAccounts(userId: number): Promise<Account[]> {
    return this.findAccountsUsecase.execute(userId);
  }

  createAccount(input: ICreateAccountInput, user: User): Promise<Account> {
    return this.createAccountUsecase.execute(input, user);
  }

  updateAccount(input: IUpdateAccountInput, user: User): Promise<Account> {
    return this.updateAccountUsecase.execute(input, user);
  }

  deleteAccount(input: IDeleteAccountInput, user: User): Promise<void> {
    return this.deleteAccountUsecase.execute(input, user);
  }
}
