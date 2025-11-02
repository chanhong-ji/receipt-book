import { Injectable } from '@nestjs/common';
import { BudgetRepository } from 'src/modules/budget/application/budget.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetModel } from '../models/budget.model';
import { Repository, RelationId, In } from 'typeorm';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Budget } from 'src/modules/budget/domain/entity/budget.entity';
import { Category } from 'src/modules/category/domain/entity/category.entity';

@Injectable()
export class TypeormBudgetRepository implements BudgetRepository {
  constructor(
    @InjectRepository(BudgetModel)
    private readonly repository: Repository<BudgetModel>,
  ) {}

  async create(yearMonth: string, totalAmount: number, user: User, categoryId?: number): Promise<Budget> {
    const savedModel = await this.repository.save(
      this.repository.create({
        yearMonth,
        totalAmount,
        user: { id: user.id },
        category: { id: categoryId },
      }),
    );
    return this.toEntity(savedModel);
  }

  async update(id: number, totalAmount: number): Promise<Budget> {
    const model = await this.repository.save({ id, totalAmount });
    return this.toEntity(model);
  }

  async findById(id: number, userId: number): Promise<Budget | null> {
    const model = await this.repository.findOne({ where: { id, user: { id: userId } } });
    return model ? this.toEntity(model) : null;
  }

  async findByCategory(yearMonth: string, user: User, categoryId?: number): Promise<Budget | null> {
    const model = await this.repository.findOne({
      where: {
        yearMonth,
        user: { id: user.id },
        category: { id: categoryId },
      },
      relations: {
        category: true,
      },
    });
    return model ? this.toEntity(model) : null;
  }

  async findManyByYearMonth(yearMonth: string, user: User): Promise<Budget[]> {
    const models = await this.repository.find({
      where: { user: { id: user.id }, yearMonth: yearMonth },
      relations: {
        category: true,
      },
    });
    return models.map(this.toEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  toEntity(model: BudgetModel): Budget {
    const budget = new Budget();
    budget.id = model.id;
    budget.yearMonth = model.yearMonth;
    budget.totalAmount = model.totalAmount;
    budget.createdAt = model.createdAt;
    budget.updatedAt = model.updatedAt;
    if (model.category) {
      const category = new Category();
      category.id = model.category.id;
      category.name = model.category.name;
      category.sortOrder = model.category.sortOrder;
      category.createdAt = model.category.createdAt;
      category.updatedAt = model.category.updatedAt;
      budget.category = category;
    }
    return budget;
  }
}
