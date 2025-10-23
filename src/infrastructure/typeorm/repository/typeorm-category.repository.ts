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

  toEntity(model: CategoryModel): Category {
    const category = new Category();
    category.id = model.id;
    category.name = model.name;
    category.sortOrder = model.sortOrder;
    category.createdAt = model.createdAt;
    category.updatedAt = model.updatedAt;
    return category;
  }
}
