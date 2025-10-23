import { Category } from '../domain/entity/category.entity';

export interface CategoryRepository {
  findAll(userId: number): Promise<Category[]>;
  save(category: Category, userId: number): Promise<Category>;
}
