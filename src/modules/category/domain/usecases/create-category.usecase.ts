import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Category } from '../entity/category.entity';
import { ICreateCategoryInput } from '../../application/dtos/create-category.dto';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';

@Injectable()
export class CreateCategoryUsecase {
  constructor(
    @Inject('CategoryRepository') private readonly repository: CategoryRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: ICreateCategoryInput, user: User): Promise<Category> {
    const categories = await this.repository.findAll(user.id);
    this.validate(categories, input.name);
    const order = this.calculateOrder(categories);
    const category = Category.create(input.name, order);
    return this.repository.save(category, user.id);
  }

  validate(existingCategories: Category[], newCategoryName: string) {
    if (existingCategories.length >= 10) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_LIMIT_EXCEEDED));
    }

    if (existingCategories.some((category) => category.name === newCategoryName)) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_ALREADY_EXISTS));
    }
  }

  calculateOrder(existingCategories: Category[]): number {
    return existingCategories.length > 0
      ? Math.max(...existingCategories.map((category) => category.sortOrder)) + 1
      : 1;
  }
}
