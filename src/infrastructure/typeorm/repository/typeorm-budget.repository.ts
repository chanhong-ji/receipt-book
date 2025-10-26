import { Injectable } from '@nestjs/common';
import { BudgetRepository } from 'src/modules/budget/application/budget.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetModel } from '../models/budget.model';
import { Repository, RelationId } from 'typeorm';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Budget } from 'src/modules/budget/domain/entity/budget.entity';

@Injectable()
export class TypeormBudgetRepository implements BudgetRepository {
  constructor(
    @InjectRepository(BudgetModel)
    private readonly repository: Repository<BudgetModel>,
  ) {}

  async create(yearMonth: string, totalAmount: number, user: User): Promise<Budget> {
    const savedModel = await this.repository.save(
      this.repository.create({
        yearMonth,
        totalAmount,
        user: { id: user.id },
      }),
    );
    return this.toEntity(savedModel);
  }

  async update(id: number, totalAmount: number): Promise<Budget> {
    const model = await this.repository.save({ id, totalAmount });
    return this.toEntity(model);
  }

  async findByYearMonth(yearMonth: string, user: User): Promise<Budget | null> {
    const model = await this.repository.findOne({
      where: {
        yearMonth,
        user: { id: user.id },
      },
    });
    if (!model) return null;
    return this.toEntity(model);
  }

  toEntity(model: BudgetModel): Budget {
    const budget = new Budget();
    budget.id = model.id;
    budget.yearMonth = model.yearMonth;
    budget.totalAmount = model.totalAmount;
    budget.createdAt = model.createdAt;
    budget.updatedAt = model.updatedAt;
    return budget;
  }
}
