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
import { AccountType } from 'src/modules/account/application/enum/account.enum';
import { registerEnumType } from '@nestjs/graphql';
import { ExpenseModel } from './expense.model';

registerEnumType(AccountType, {
  name: 'AccountType',
});

@Entity({ name: 'account' })
export class AccountModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => UserModel, (user) => user.accounts, { nullable: false })
  user: UserModel;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: AccountType, nullable: false })
  type: AccountType;

  @OneToMany(() => ExpenseModel, (expense) => expense.account, { cascade: true })
  expenses: ExpenseModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
