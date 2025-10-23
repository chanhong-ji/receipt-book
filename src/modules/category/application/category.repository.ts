import { Category } from '../domain/entity/category.entity';

export interface CategoryRepository {
  findAll(userId: number): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  updateMany(categories: Category[]): Promise<Category[]>;
  save(category: Category, userId: number): Promise<Category>;
  delete(id: number): Promise<void>;
}
