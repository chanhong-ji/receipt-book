import { Injectable } from '@nestjs/common';
import { Expense } from './entity/expense.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ICreateExpenseInput } from '../application/dtos/create-expense.dto';
import { IUpdateExpenseInput } from '../application/dtos/update-expense.dto';
import { IDeleteExpenseInput } from '../application/dtos/delete-expense.dto';
import { IFindExpenseMonthlyInput, IFindExpenseMonthlyOutput } from '../application/dtos/find-expense-monthly.dto';
import {
  IFindMonthlyExpenseTotalInput,
  IFindMonthlyExpenseTotalOutput,
} from '../application/dtos/find-monthly-expense-total.dto';
import {
  IFindCategoryMonthlyExpenseInput,
  IFindCategoryMonthlyExpenseOutput,
} from '../application/dtos/find-category-monthly-expense.dto';
import { CreateExpenseUsecase } from './usecases/create-expense.usecase';
import { UpdateExpenseUsecase } from './usecases/update-expense.usecase';
import { DeleteExpenseUsecase } from './usecases/delete-expense.usecase';
import { FindExpenseMonthlyUsecase } from './usecases/find-expense-monthly.usecase';
import { FindMonthlyExpenseTotalUsecase } from './usecases/find-monthly-expense-total.usecase';
import { FindCategoryMonthlyExpenseUsecase } from './usecases/find-category-monthly-expense.usecase';
import { IFindSummaryInput } from '../application/dtos/find-summary.dto';
import { IFindSummaryOutput } from '../application/dtos/find-summary.dto';
import { FindSummaryUsecase } from './usecases/find-summary.usecase';

@Injectable()
export class ExpenseFactory {
  constructor(
    private readonly createExpenseUsecase: CreateExpenseUsecase,
    private readonly updateExpenseUsecase: UpdateExpenseUsecase,
    private readonly deleteExpenseUsecase: DeleteExpenseUsecase,
    private readonly findExpenseMonthlyUsecase: FindExpenseMonthlyUsecase,
    private readonly findMonthlyExpenseTotalUsecase: FindMonthlyExpenseTotalUsecase,
    private readonly findCategoryMonthlyExpenseUsecase: FindCategoryMonthlyExpenseUsecase,
    private readonly findSummaryUsecase: FindSummaryUsecase,
  ) {}

  createExpense(input: ICreateExpenseInput, user: User): Promise<Expense> {
    return this.createExpenseUsecase.execute(input, user);
  }

  updateExpense(input: IUpdateExpenseInput, user: User): Promise<Expense> {
    return this.updateExpenseUsecase.execute(input, user);
  }

  deleteExpense(input: IDeleteExpenseInput, user: User): Promise<void> {
    return this.deleteExpenseUsecase.execute(input, user);
  }

  findExpenseMonthly(input: IFindExpenseMonthlyInput, user: User): Promise<IFindExpenseMonthlyOutput> {
    return this.findExpenseMonthlyUsecase.execute(input, user);
  }

  findMonthlyExpenseTotal(input: IFindMonthlyExpenseTotalInput, user: User): Promise<IFindMonthlyExpenseTotalOutput> {
    return this.findMonthlyExpenseTotalUsecase.execute(input, user);
  }

  findCategoryMonthlyExpense(
    input: IFindCategoryMonthlyExpenseInput,
    user: User,
  ): Promise<IFindCategoryMonthlyExpenseOutput> {
    return this.findCategoryMonthlyExpenseUsecase.execute(input, user);
  }

  findSummary(input: IFindSummaryInput, user: User): Promise<IFindSummaryOutput> {
    return this.findSummaryUsecase.execute(input, user);
  }
}
