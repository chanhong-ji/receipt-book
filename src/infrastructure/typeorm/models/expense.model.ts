import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.model';
import { MerchantModel } from './merchant.model';
import { AccountModel } from './account.model';

@Entity({ name: 'expense' })
export class ExpenseModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => UserModel, (user) => user.expenses, { nullable: false })
  user: UserModel;

  @ManyToOne(() => AccountModel, (account) => account.expenses, { nullable: false })
  account: AccountModel;

  @ManyToOne(() => MerchantModel, { nullable: true })
  merchant?: MerchantModel;

  @Column({ name: 'merchant_text', nullable: true })
  merchantText?: string;

  @Column({ nullable: true })
  memo?: string;

  @Column({ name: 'posted_at', type: 'timestamp', nullable: false })
  postedAt: Date;

  @Column({ type: 'integer', nullable: false })
  year: number;

  @Column({ type: 'integer', nullable: false })
  month: number;

  @Column({ type: 'integer', nullable: false })
  date: number;
}
