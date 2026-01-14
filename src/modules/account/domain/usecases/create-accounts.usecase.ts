import { Inject, Injectable } from '@nestjs/common';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { AccountRepository } from '../../application/account.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Account } from '../entity/account.entity';
import { ICreateAccountInput } from '../../application/dtos/create-account.dto';

@Injectable()
export class CreateAccountUsecase {
  constructor(
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: ICreateAccountInput, user: User): Promise<Account> {
    await this.validateDuplicatedName(user, input.name);
    const account = Account.create(input.name, input.type);
    return this.accountRepository.save(account, user.id);
  }

  async validateDuplicatedName(user: User, name: string): Promise<void> {
    const existingAccounts = await this.accountRepository.findAll(user.id);

    if (existingAccounts.some((existingAccount) => existingAccount.name === name)) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ACCOUNT_ALREADY_EXISTS));
    }
  }
}
