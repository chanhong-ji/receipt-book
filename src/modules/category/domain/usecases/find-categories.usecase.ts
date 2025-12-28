import { DateTime } from 'luxon';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { Category } from '../entity/category.entity';

@Injectable()
export class FindCategoriesUsecase {
  constructor(@Inject('CategoryRepository') private readonly repository: CategoryRepository) {}

  async execute(userId: number): Promise<Category[]> {
    const today = DateTime.now();
    const thisYear = today.year;
    const thisMonth = today.month;
    return this.repository.findAllWithTotalExpense(userId, thisYear, thisMonth);
  }
}
