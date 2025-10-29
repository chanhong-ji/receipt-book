import { Category } from 'src/modules/category/domain/entity/category.entity';
import { User } from '../../../user/domain/entity/user.entity';

export class Budget {
  id: number;
  user?: User;
  category?: Category;
  yearMonth: string; // YYYY-MM-01
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
