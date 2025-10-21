import { User } from './user.entity';

export class Budget {
  id: number;
  user?: User;
  yearMonth: Date; // YYYY-MM-01 00:00:00
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
