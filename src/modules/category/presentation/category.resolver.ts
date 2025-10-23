import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryFactory } from '../domain/category.factory';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { FindCategoriesOutput } from './dtos/find-categories.dto';
import { CreateCategoryInput, CreateCategoryOutput } from './dtos/create-category.dto';
import { UpdateCategoryInput, UpdateCategoryOutput } from './dtos/update-category.dto';

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

  @Mutation(() => CreateCategoryOutput)
  async createCategory(
    @Args('CreateCategoryInput') input: CreateCategoryInput,
    @AuthUser() user: User,
  ): Promise<CreateCategoryOutput> {
    const category = await this.factory.createCategory(input, user);
    return {
      ok: true,
      category,
    };
  }

  @Mutation(() => UpdateCategoryOutput)
  async updateCategory(
    @Args('UpdateCategoryInput') input: UpdateCategoryInput,
    @AuthUser() user: User,
  ): Promise<UpdateCategoryOutput> {
    const category = await this.factory.updateCategory(input, user);
    return {
      ok: true,
      category,
    };
  }
}
