import { User } from 'src/modules/user/domain/entity/user.entity';
import { Budget } from '../domain/entity/budget.entity';

export interface BudgetRepository {
  create(yearMonth: string, totalAmount: number, user: User, categoryId?: number): Promise<Budget>;
  update(id: number, totalAmount: number): Promise<Budget>;
  findById(id: number, userId: number): Promise<Budget | null>;
  findMany(yearMonths: string[], user: User): Promise<Budget[]>;
  findByYearMonth(yearMonth: string, user: User, categoryId?: number): Promise<Budget | null>;
  delete(id: number): Promise<void>;
}
