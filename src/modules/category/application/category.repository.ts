import { Category } from '../domain/entity/category.entity';

export interface CategoryRepository {
  findAll(userId: number): Promise<Category[]>;
}
