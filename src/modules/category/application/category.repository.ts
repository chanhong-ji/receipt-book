import { Category } from '../domain/entity/category.entity';

export interface CategoryRepository {
  findAll(userId: number): Promise<Category[]>;
  findAllWithTotalExpense(userId: number, year: number, month: number): Promise<Category[]>;
  findById(id: number, userId: number): Promise<Category | null>;
  update(category: Category): Promise<Category>;
  updateMany(categories: Category[]): Promise<Category[]>;
  save(category: Category, userId: number): Promise<Category>;
  delete(id: number): Promise<void>;
}
