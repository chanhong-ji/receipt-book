import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExpenseFactory } from '../domain/expense.factory';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CreateExpenseInput } from './dtos/create-expense.dto';
import { CreateExpenseOutput } from './dtos/create-expense.dto';

@Resolver()
export class ExpenseResolver {
  constructor(private readonly factory: ExpenseFactory) {}

  @Mutation(() => CreateExpenseOutput)
  async createExpense(
    @Args('CreateExpenseInput') input: CreateExpenseInput,
    @AuthUser() user: User,
  ): Promise<CreateExpenseOutput> {
    const expense = await this.factory.createExpense(input, user);
    return {
      ok: true,
      expense,
    };
  }
}
