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

  async findById(id: number, userId: number): Promise<Account | null> {
    const model = await this.repository.findOne({ where: { id, user: { id: userId } } });
    if (!model) return null;
    return this.toEntity(model);
  }

  async update(account: Account): Promise<Account> {
    const model = await this.repository.save(account);
    return this.toEntity(model);
  }

  async save(account: Account, userId: number): Promise<Account> {
    const model = await this.repository.save(
      this.repository.create({
        name: account.name,
        type: account.type,
        isActive: account.isActive,
        user: { id: userId },
      }),
    );
    return this.toEntity(model);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
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
