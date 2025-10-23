import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { Category } from '../entity/category.entity';

@Injectable()
export class FindCategoriesUsecase {
  constructor(@Inject('CategoryRepository') private readonly repository: CategoryRepository) {}

  async execute(userId: number): Promise<Category[]> {
    return this.repository.findAll(userId);
  }
}
