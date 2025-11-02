import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AccountFactory } from '../domain/account.factory';
import { FindAccountsOutput } from './dtos/find-accounts.dto';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-accout.dto';
import { UpdateAccountInput, UpdateAccountOutput } from './dtos/update-account.dto';
import { DeleteAccountInput, DeleteAccountOutput } from './dtos/delete-account.dto';

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

  @Mutation(() => UpdateAccountOutput)
  async updateAccount(
    @Args('UpdateAccountInput') input: UpdateAccountInput,
    @AuthUser() user: User,
  ): Promise<UpdateAccountOutput> {
    const account = await this.factory.updateAccount(input, user);
    return {
      ok: true,
      account,
    };
  }

  @Mutation(() => DeleteAccountOutput)
  async deleteAccount(
    @Args('DeleteAccountInput') input: DeleteAccountInput,
    @AuthUser() user: User,
  ): Promise<DeleteAccountOutput> {
    await this.factory.deleteAccount(input, user);
    return { ok: true };
  }
}
