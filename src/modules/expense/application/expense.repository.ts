import { Expense } from '../domain/entity/expense.entity';

export interface ExpenseRepository {
  findById(id: number, userId: number): Promise<Expense | null>;
  update(expense: Expense): Promise<Expense>;
  save(expense: Expense): Promise<Expense>;
}
