import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { AccountModel } from '../models/account.model';
import { Repository } from 'typeorm';
import { Account } from 'src/modules/account/domain/entity/account.entity';

@Injectable()
export class TypeormAccountRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountModel)
    private readonly repository: Repository<AccountModel>,
  ) {}

  async findAll(userId: number): Promise<Account[]> {
    const models = await this.repository.find({ where: { user: { id: userId } } });
    return models.map(this.toEntity);
  }

  toEntity(model: AccountModel): Account {
    const account = new Account();
    account.id = model.id;
    account.name = model.name;
    account.isActive = model.isActive;
    account.type = model.type;
    account.createdAt = model.createdAt;
    account.updatedAt = model.updatedAt;
    return account;
  }
}
