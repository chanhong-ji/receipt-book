import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { BudgetFactory } from '../domain/budget.factory';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { UpsertBudgetInput, UpsertBudgetOutput } from './dtos/upsert-budget.dto';

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
}
