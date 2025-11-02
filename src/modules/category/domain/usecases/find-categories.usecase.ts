import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { Category } from '../entity/category.entity';

@Injectable()
export class FindCategoriesUsecase {
  constructor(@Inject('CategoryRepository') private readonly repository: CategoryRepository) {}

  async execute(userId: number): Promise<Category[]> {
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth() + 1;
    return this.repository.findAllWithTotalExpense(userId, thisYear, thisMonth);
  }
}
