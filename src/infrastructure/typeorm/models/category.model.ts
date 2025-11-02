import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { ExpenseModel } from './expense.model';
import { BudgetModel } from './budget.model';

@Entity({ name: 'category' })
export class CategoryModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => UserModel, (user) => user.categories, { nullable: true })
  user: UserModel;

  @Column({ name: 'sort_order', nullable: false })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ExpenseModel, (expense) => expense.category)
  expenses: ExpenseModel[];

  @OneToMany(() => BudgetModel, (budget) => budget.category)
  budgets: BudgetModel[];
}
