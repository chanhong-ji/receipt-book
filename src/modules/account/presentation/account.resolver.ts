import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountFactory } from '../domain/account.factory';
import { FindAccountsOutput } from './dtos/find-accounts.dto';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-accout.dto';

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

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('CreateAccountInput') input: CreateAccountInput,
    @AuthUser() user: User,
  ): Promise<CreateAccountOutput> {
    const account = await this.factory.createAccount(input, user);
    return {
      ok: true,
      account,
    };
  }
}
