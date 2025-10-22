import { AccountType } from 'src/modules/user/domain/enum/account.enum';

export interface ICreateAccountInput {
  name: string;
  type: AccountType;
}
