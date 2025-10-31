import { Budget } from '../../domain/entity/budget.entity';

export interface IFindBudgetInput {
  year: number;
  months: number[];
}

export interface IFindBudgetOutput {
  budgets: Budget[];
}
