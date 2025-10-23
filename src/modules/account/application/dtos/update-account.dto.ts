import { AccountType } from 'src/modules/user/domain/enum/account.enum';

export interface IUpdateAccountInput {
  id: number;
  name?: string;
  type?: AccountType;
  isActive?: boolean;
}
