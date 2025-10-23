import { Injectable } from '@nestjs/common';
import { FindCategoriesUsecase } from './usecases/find-categories.usecase';
import { Category } from './entity/category.entity';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { ICreateCategoryInput } from '../application/dtos/create-category.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';

@Injectable()
export class CategoryFactory {
  constructor(
    private readonly findCategoriesUsecase: FindCategoriesUsecase,
    private readonly createCategoriesUsecase: CreateCategoryUsecase,
  ) {}

  findCategories(userId: number): Promise<Category[]> {
    return this.findCategoriesUsecase.execute(userId);
  }

  createCategory(input: ICreateCategoryInput, user: User): Promise<Category> {
    return this.createCategoriesUsecase.execute(input, user);
  }
}
