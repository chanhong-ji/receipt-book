import { Injectable } from '@nestjs/common';
import { FindCategoriesUsecase } from './usecases/find-categories.usecase';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryFactory {
  constructor(private readonly findCategoriesUsecase: FindCategoriesUsecase) {}

  findCategories(userId: number): Promise<Category[]> {
    return this.findCategoriesUsecase.execute(userId);
  }
}
