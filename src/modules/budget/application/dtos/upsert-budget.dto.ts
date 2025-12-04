import { Budget } from '../../domain/entity/budget.entity';

export interface IUpsertBudgetInput {
  year: number;
  month: number;
  totalAmount: number;
  categoryId: number;
}

export interface IUpsertBudgetOutput {
  budget: Budget;
}
