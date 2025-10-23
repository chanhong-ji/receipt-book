import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CategoryDto } from './category.dto';
import { ICreateCategoryInput } from '../../application/dtos/create-category.dto';

@InputType()
export class CreateCategoryInput implements ICreateCategoryInput {
  @Field(() => String, { description: '카테고리 이름' })
  name: string;
}

@ObjectType()
export class CreateCategoryOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => CategoryDto, { nullable: true, description: '생성된 카테고리' })
  category: CategoryDto;
}
