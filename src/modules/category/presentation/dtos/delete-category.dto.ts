import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IDeleteCategoryInput } from '../../application/dtos/delete-category.dto';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteCategoryInput implements IDeleteCategoryInput {
  @Field(() => Int, { description: '카테고리 ID' })
  @IsInt()
  id: number;
}

@ObjectType()
export class DeleteCategoryOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
