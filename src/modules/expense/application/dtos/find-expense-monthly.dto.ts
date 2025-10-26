import { Expense } from '../../domain/entity/expense.entity';

export interface IFindExpenseMonthlyInput {
  year: number; // 2025 (YYYY)
  month: number; // 1~12 (MM)
  categoryIds?: number[]; // 다중 선택
  accountIds?: number[]; // 다중 선택
  skip: number;
  take: number;
}

export interface IFindExpenseMonthlyOutput {
  expenses: Expense[];
  totalCount: number;
}
