import { User } from 'src/modules/user/domain/entity/user.entity';
import { Expense } from '../domain/entity/expense.entity';
import { IFindExpenseMonthlyInput } from './dtos/find-expense-monthly.dto';
import { IFindMonthlyExpenseTotalInput, IFindMonthlyExpenseTotalOutput } from './dtos/find-monthly-expense-total.dto';

export interface ExpenseRepository {
  findById(id: number, userId: number): Promise<Expense | null>;
  update(expense: Expense): Promise<Expense>;
  save(expense: Expense): Promise<Expense>;
  delete(id: number): Promise<void>;

  findMonthly(input: IFindExpenseMonthlyInput, user: User): Promise<{ expenses: Expense[]; totalCount: number }>;
  findMonthlyExpenseTotal(input: IFindMonthlyExpenseTotalInput, user: User): Promise<IFindMonthlyExpenseTotalOutput>;
}
