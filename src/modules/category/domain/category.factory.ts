import { Injectable } from '@nestjs/common';
import { Category } from './entity/category.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ICreateCategoryInput } from '../application/dtos/create-category.dto';
import { IUpdateCategoryInput } from '../application/dtos/update-category.dto';
import { FindCategoriesUsecase } from './usecases/find-categories.usecase';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { UpdateCategoryUsecase } from './usecases/update-category.usecase';

@Injectable()
export class CategoryFactory {
  constructor(
    private readonly findCategoriesUsecase: FindCategoriesUsecase,
    private readonly createCategoriesUsecase: CreateCategoryUsecase,
    private readonly updateCategoryUsecase: UpdateCategoryUsecase,
  ) {}

  findCategories(userId: number): Promise<Category[]> {
    return this.findCategoriesUsecase.execute(userId);
  }

  createCategory(input: ICreateCategoryInput, user: User): Promise<Category> {
    return this.createCategoriesUsecase.execute(input, user);
  }

  updateCategory(input: IUpdateCategoryInput, user: User): Promise<Category> {
    return this.updateCategoryUsecase.execute(input, user);
  }
}
