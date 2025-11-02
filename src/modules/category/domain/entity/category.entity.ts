import { User } from 'src/modules/user/domain/entity/user.entity';

export class Category {
  id: number;
  name: string;
  user?: User;
  sortOrder: number; // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
  totalExpense?: number;

  static create(name: string, sortOrder: number): Category {
    const category = new Category();
    category.name = name;
    category.sortOrder = sortOrder;
    return category;
  }
}
