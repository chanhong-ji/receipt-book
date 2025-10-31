import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { BudgetFactory } from '../domain/budget.factory';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { UpsertBudgetInput, UpsertBudgetOutput } from './dtos/upsert-budget.dto';
import { DeleteBudgetInput, DeleteBudgetOutput } from './dtos/delete-budget.dto';
import { FindBudgetInput, FindBudgetOutput } from './dtos/find-budget.dto';

@Resolver()
export class BudgetResolver {
  constructor(private readonly factory: BudgetFactory) {}

  @Mutation(() => UpsertBudgetOutput)
  async upsertBudget(
    @Args('UpsertBudgetInput') input: UpsertBudgetInput,
    @AuthUser() user: User,
  ): Promise<UpsertBudgetOutput> {
    const { budget } = await this.factory.upsertBudget(input, user);
    return {
      ok: true,
      budget,
    };
  }

  @Mutation(() => DeleteBudgetOutput)
  async deleteBudget(
    @Args('DeleteBudgetInput') input: DeleteBudgetInput,
    @AuthUser() user: User,
  ): Promise<DeleteBudgetOutput> {
    await this.factory.deleteBudget(input, user);
    return {
      ok: true,
    };
  }

  @Query(() => FindBudgetOutput)
  async findBudgets(
    @Args('FindBudgetInput') input: FindBudgetInput,
    @AuthUser() user: User,
  ): Promise<FindBudgetOutput> {
    const { budgets } = await this.factory.findBudgets(input, user);
    return {
      ok: true,
      budgets,
    };
  }
}
