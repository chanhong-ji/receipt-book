import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountModel } from './account.model';

@Entity({ name: 'user' })
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => AccountModel, (account) => account.user, { cascade: true })
  accounts: AccountModel[];
}
