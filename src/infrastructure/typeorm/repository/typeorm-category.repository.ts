import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { CategoryModel } from '../models/category.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/modules/category/domain/entity/category.entity';

@Injectable()
export class TypeormCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly repository: Repository<CategoryModel>,
  ) {}

  async findAll(userId: number): Promise<Category[]> {
    const models = await this.repository.find({ where: { user: { id: userId } } });
    return models.map(this.toEntity);
  }

  /**
   * 이번달 지출 총액을 포함한 카테고리 목록을 조회합니다.
   */
  async findAllWithTotalExpense(userId: number, year: number, month: number): Promise<Category[]> {
    const models = await this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.expenses', 'expense', 'expense.year = :year AND expense.month = :month')
      .where('category.userId = :userId', { userId })
      .setParameters({ year, month })
      .groupBy('category.id')
      .select('category.*')
      .addSelect('SUM(expense.amount)', 'total_expense')
      .orderBy('category.name', 'ASC')
      .getRawMany();

    return models.map(this.toEntityRaw);
  }

  async findById(id: number, userId: number): Promise<Category | null> {
    const model = await this.repository.findOne({ where: { id, user: { id: userId } } });
    if (!model) return null;
    return this.toEntity(model);
  }

  async update(category: Category): Promise<Category> {
    const model = await this.repository.save(category);
    return this.toEntity(model);
  }

  async updateMany(categories: Category[]): Promise<Category[]> {
    const models = await this.repository.save(categories);
    return models.map(this.toEntity);
  }

  async save(category: Category, userId: number): Promise<Category> {
    const model = await this.repository.save(
      this.repository.create({
        name: category.name,
        sortOrder: category.sortOrder,
        user: { id: userId },
      }),
    );
    return this.toEntity(model);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  toEntity(model: CategoryModel): Category {
    const category = new Category();
    category.id = model.id;
    category.name = model.name;
    category.sortOrder = model.sortOrder;
    category.createdAt = model.createdAt;
    category.updatedAt = model.updatedAt;
    return category;
  }

  toEntityRaw(raw: CategoryRaw): Category {
    const category = new Category();
    category.id = raw.id;
    category.name = raw.name;
    category.sortOrder = raw.sort_order;
    category.createdAt = raw.created_at;
    category.updatedAt = raw.updated_at;
    category.totalExpense = raw.total_expense ?? 0;
    return category;
  }
}

interface CategoryRaw {
  id: number;
  name: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  total_expense?: number;
}
