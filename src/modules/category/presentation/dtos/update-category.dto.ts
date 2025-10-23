import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IUpdateCategoryInput } from '../../application/dtos/update-category.dto';
import { IsString } from 'class-validator';
import { CategoryDto } from './category.dto';

@InputType()
export class UpdateCategoryInput implements IUpdateCategoryInput {
  @Field(() => Int, { description: '카테고리 ID' })
  id: number;

  @Field(() => String, { description: '카테고리 이름' })
  @IsString()
  name: string;
}

@ObjectType()
export class UpdateCategoryOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => CategoryDto, { description: '수정된 카테고리', nullable: true })
  category: CategoryDto;
}
