import { Merchant } from 'src/modules/merchant/domain/entity/merchant.entity';
import { Account } from 'src/modules/account/domain/entity/account.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Category } from 'src/modules/category/domain/entity/category.entity';

export class Expense {
  id: number;
  name: string;
  amount: number;
  postedAt: Date; // YYYY-MM-DD
  year: number;
  month: number;
  date: number;
  userId: number;
  user?: User;
  accountId: number;
  account?: Account;
  categoryId?: number;
  category?: Category;
  merchantId?: number;
  merchant?: Merchant;
  merchantText?: string;
  memo?: string;

  static create(input: ICreate): Expense {
    const expense = new Expense();
    expense.name = input.name;
    expense.amount = input.amount;
    expense.postedAt = input.postedAt;
    expense.year = input.postedAt.getFullYear();
    expense.month = input.postedAt.getMonth() + 1;
    expense.date = input.postedAt.getDate();
    expense.userId = input.userId;
    expense.accountId = input.accountId;
    expense.categoryId = input.categoryId;
    expense.merchantId = input.merchantId;
    expense.merchantText = input.merchantText;
    expense.memo = input.memo;
    return expense;
  }
}

interface ICreate {
  name: string;
  amount: number;
  userId: number;
  accountId: number;
  postedAt: Date;
  merchantText?: string;
  memo?: string;
  categoryId?: number;
  merchantId?: number;
}
