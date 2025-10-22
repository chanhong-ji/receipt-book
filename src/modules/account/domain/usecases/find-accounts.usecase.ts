import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../application/account.repository';
import { Account } from '../entity/account.entity';

@Injectable()
export class FindAccountsUsecase {
  constructor(@Inject('AccountRepository') private readonly repository: AccountRepository) {}

  async execute(userId: number): Promise<Account[]> {
    return this.repository.findAll(userId);
  }
}
