import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../application/account.repository';
import { Account } from '../entity/account.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { IUpdateAccountInput } from '../../application/dtos/update-account.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';

@Injectable()
export class UpdateAccountUsecase {
  constructor(
    @Inject('AccountRepository') private readonly repository: AccountRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IUpdateAccountInput, user: User): Promise<Account> {
    const account = await this.findAccount(input.id, user);
    await this.validateDuplicatedName(user.id, input.name, account.id);

    account.update({
      name: input.name,
      type: input.type,
      isActive: input.isActive,
    });

    return this.repository.update(account);
  }

  async findAccount(id: number, user: User): Promise<Account> {
    const account = await this.repository.findById(id, user.id);

    if (!account) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    return account;
  }

  async validateDuplicatedName(userId: number, accountName: string | undefined, existingAccountId: number) {
    if (!accountName) return;

    const accounts = await this.repository.findAll(userId);

    if (
      accounts.some(
        (existingAccount) =>
          existingAccount.name === accountName && //
          existingAccount.id !== existingAccountId,
      )
    ) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ACCOUNT_ALREADY_EXISTS));
    }
  }
}
