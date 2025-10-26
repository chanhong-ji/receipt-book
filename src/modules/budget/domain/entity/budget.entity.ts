import { User } from '../../../user/domain/entity/user.entity';

export class Budget {
  id: number;
  user?: User;
  yearMonth: string; // YYYY-MM-01
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
