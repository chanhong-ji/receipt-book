import { Category } from 'src/modules/category/domain/entity/category.entity';
import { Account } from './account.entity';
import { Expense } from 'src/modules/expense/domain/entity/expense.entity';
import { Budget } from './budget.entity';

export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accounts?: Account[];
  categories?: Category[];
  expenses?: Expense[];
  budgets?: Budget[];

  static create(email: string, name: string, password: string): User {
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = password;
    return user;
  }
}
