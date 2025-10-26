import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserModel } from './user.model';

@Entity({ name: 'budget' })
@Unique(['user', 'yearMonth'])
export class BudgetModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserModel, (user) => user.budgets, { nullable: false })
  user: UserModel;

  @Column({ name: 'year_month', type: 'date', nullable: false })
  yearMonth: string; // YYYY-MM-01

  @Column({ name: 'total_amount', nullable: false })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
