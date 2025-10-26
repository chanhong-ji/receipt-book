import { Budget } from '../../domain/entity/budget.entity';

export interface IUpsertBudgetInput {
  year: number;
  month: number;
  totalAmount: number;
}

export interface IUpsertBudgetOutput {
  budget: Budget;
}
