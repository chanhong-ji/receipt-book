import { AccountType } from '../../../user/domain/enum/account.enum';
import { User } from '../../../user/domain/entity/user.entity';

export class Account {
  id: number;
  name: string;
  user?: User;
  isActive: boolean;
  type: AccountType;
  createdAt: Date;
  updatedAt: Date;

  static create(name: string, type: AccountType, user: User): Account {
    const account = new Account();
    account.name = name;
    account.type = type;
    account.user = user;
    account.isActive = true;
    return account;
  }

  update(input: IAccountUpdate): void {
    if (input.name) {
      this.name = input.name;
    }
    if (input.type) {
      this.type = input.type;
    }
    if (input.isActive != null) {
      this.isActive = input.isActive;
    }
  }
}

interface IAccountUpdate {
  name?: string;
  type?: AccountType;
  isActive?: boolean;
}
