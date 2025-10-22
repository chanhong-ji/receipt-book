import { Resolver, Query } from '@nestjs/graphql';
import { AccountFactory } from '../domain/account.factory';
import { FindAccountsOutput } from './dtos/find-accounts.dto';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';

@Resolver()
export class AccountResolver {
  constructor(private readonly factory: AccountFactory) {}

  @Query(() => FindAccountsOutput)
  async findAccounts(@AuthUser() user: User): Promise<FindAccountsOutput> {
    const accounts = await this.factory.findAccounts(user.id);
    return {
      ok: true,
      accounts,
    };
  }
}
