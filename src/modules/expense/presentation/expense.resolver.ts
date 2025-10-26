import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExpenseFactory } from '../domain/expense.factory';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CreateExpenseInput, CreateExpenseOutput } from './dtos/create-expense.dto';
import { UpdateExpenseInput, UpdateExpenseOutput } from './dtos/update-expense.dto';
import { DeleteExpenseInput, DeleteExpenseOutput } from './dtos/delete-expense.dto';
import { FindExpenseMonthlyInput, FindExpenseMonthlyOutput } from './dtos/find-expense-monthly.dto';
import { FindMonthlyExpenseTotalInput, FindMonthlyExpenseTotalOutput } from './dtos/find-monthly-expense-total.dto';

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

  @Mutation(() => UpdateExpenseOutput)
  async updateExpense(
    @Args('UpdateExpenseInput') input: UpdateExpenseInput,
    @AuthUser() user: User,
  ): Promise<UpdateExpenseOutput> {
    const expense = await this.factory.updateExpense(input, user);
    return {
      ok: true,
      expense,
    };
  }

  @Mutation(() => DeleteExpenseOutput)
  async deleteExpense(
    @Args('DeleteExpenseInput') input: DeleteExpenseInput,
    @AuthUser() user: User,
  ): Promise<DeleteExpenseOutput> {
    await this.factory.deleteExpense(input, user);
    return { ok: true };
  }

  @Query(() => FindExpenseMonthlyOutput)
  async findExpenseMonthly(
    @Args('FindExpenseMonthlyInput') input: FindExpenseMonthlyInput,
    @AuthUser() user: User,
  ): Promise<FindExpenseMonthlyOutput> {
    const { expenses, totalCount } = await this.factory.findExpenseMonthly(input, user);
    return { ok: true, expenses, totalCount };
  }

  @Query(() => FindMonthlyExpenseTotalOutput)
  async findMonthlyExpenseTotal(
    @Args('FindMonthlyExpenseTotalInput') input: FindMonthlyExpenseTotalInput,
    @AuthUser() user: User,
  ): Promise<FindMonthlyExpenseTotalOutput> {
    const { months } = await this.factory.findMonthlyExpenseTotal(input, user);
    return { ok: true, months };
  }
}
