import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryDto } from './category.dto';

@ObjectType()
export class FindCategoriesOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [CategoryDto], { nullable: true, description: '카테고리 목록' })
  categories: CategoryDto[];
}
