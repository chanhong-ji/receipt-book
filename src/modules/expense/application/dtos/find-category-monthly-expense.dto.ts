export interface IFindCategoryMonthlyExpenseInput {
  year: number;
  months: number[];
}

export interface IFindCategoryMonthlyExpenseOutput {
  result: { categoryId: number; totalExpense: number }[];
}
