import { Budget } from '../../domain/entity/budget.entity';

export interface IFindBudgetInput {
  year: number;
  month: number;
}

export interface IFindBudgetOutput {
  budgets: Budget[];
}
