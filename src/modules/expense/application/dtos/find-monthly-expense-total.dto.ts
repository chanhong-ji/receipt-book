export interface IFindMonthlyExpenseTotalInput {
  year: number;
  months: number[];
}

export interface IFindMonthlyExpenseTotalOutput {
  months: {
    month: number;
    totalExpense: number;
  }[];
}
