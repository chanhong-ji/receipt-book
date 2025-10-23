import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../application/category.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IDeleteCategoryInput } from '../../application/dtos/delete-category.dto';
import { Category } from '../entity/category.entity';

@Injectable()
export class DeleteCategoryUsecase {
  constructor(
    @Inject('CategoryRepository') private readonly repository: CategoryRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IDeleteCategoryInput, user: User): Promise<void> {
    const categories = await this.repository.findAll(user.id);
    const category = categories.find((c) => c.id === input.id);
    if (!category) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_NOT_FOUND));
    }
    const remaining = categories.filter((c) => c.id !== input.id);
    const reindexed = this.reindexSortOrders(remaining);

    await this.repository.delete(input.id);
    await this.repository.updateMany(reindexed);
  }

  reindexSortOrders(categories: Category[]): Category[] {
    const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    return sorted.map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
  }
}
