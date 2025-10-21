import { AccountType } from '../enum/account.enum';
import { User } from './user.entity';

export class Account {
  id: number;
  name: string;
  user?: User;
  isActive: boolean;
  type: AccountType;
  createdAt: Date;
  updatedAt: Date;
}
