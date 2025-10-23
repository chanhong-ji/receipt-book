import { Expense } from '../domain/entity/expense.entity';

export interface ExpenseRepository {
  save(expense: Expense): Promise<Expense>;
}
