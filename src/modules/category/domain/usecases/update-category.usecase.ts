import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { IUpdateCategoryInput } from '../../application/dtos/update-category.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Category } from '../entity/category.entity';

@Injectable()
export class UpdateCategoryUsecase {
  constructor(
    @Inject('CategoryRepository') private readonly repository: CategoryRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IUpdateCategoryInput, user: User): Promise<Category> {
    const categories = await this.repository.findAll(user.id);
    const category = categories.find((c) => c.id === input.id);

    if (!category) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_NOT_FOUND));
    }

    if (this.isDuplicatedName(categories, input)) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_ALREADY_EXISTS));
    }

    category.name = input.name;
    return this.repository.update(category);
  }

  isDuplicatedName(categories: Category[], input: IUpdateCategoryInput): boolean {
    return categories.some((c) => c.name === input.name && c.id !== input.id);
  }
}
