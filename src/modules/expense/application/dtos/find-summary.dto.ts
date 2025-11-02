import { Category } from 'src/modules/category/domain/entity/category.entity';

export interface IFindSummaryInput {
  thisYear: number;
  thisMonth: number;
}

export interface IFindSummaryOutput {
  summary: {
    lastMonthExpense: number;
    thisMonthExpense: number;
    topCategory: Category[];
  };
}
