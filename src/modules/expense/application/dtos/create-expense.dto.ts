export interface ICreateExpenseInput {
  name: string;
  amount: number;
  postedAt: Date;
  accountId: number;
  categoryId?: number;
  merchantId?: number;
  merchantText?: string;
  memo?: string;
}
