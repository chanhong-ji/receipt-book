import { Resolver, Query } from '@nestjs/graphql';
import { CategoryFactory } from '../domain/category.factory';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { FindCategoriesOutput } from './dtos/find-categories.dto';

@Resolver()
export class CategoryResolver {
  constructor(private readonly factory: CategoryFactory) {}

  @Query(() => FindCategoriesOutput)
  async findCategories(@AuthUser() user: User): Promise<FindCategoriesOutput> {
    const categories = await this.factory.findCategories(user.id);
    return {
      ok: true,
      categories,
    };
  }
}
