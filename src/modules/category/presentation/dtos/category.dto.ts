import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class CategoryDto {
  @Field(() => Int, { description: '카테고리 ID' })
  id: number;

  @Field(() => String, { description: '카테고리 이름' })
  name: string;

  @Field(() => Int, { description: '정렬 순서' })
  sortOrder: number;

  @Field(() => Int, { description: '이번달 지출 총액', nullable: true })
  totalExpense?: number;
}
