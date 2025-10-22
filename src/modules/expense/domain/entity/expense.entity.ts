import { Merchant } from 'src/modules/merchant/domain/entity/merchant.entity';
import { Account } from 'src/modules/account/domain/entity/account.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';

export class Expense {
  id: number;
  name: string;
  amount: number;
  postedAt: Date;
  year: number;
  month: number;
  date: number;
  user?: User;
  account?: Account;
  merchant?: Merchant;
  merchantText?: string;
  memo?: string;
}
