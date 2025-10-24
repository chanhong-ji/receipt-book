import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class ExpenseDto {
  @Field(() => Int, { description: '지출 ID' })
  id: number;

  @Field(() => String, { description: '지출 이름' })
  name: string;

  @Field(() => Number, { description: '지출 금액' })
  amount: number;

  @Field(() => Date, { description: '지출 날짜' })
  postedAt: Date;

  @Field(() => Int, { description: '계좌 ID', nullable: true })
  accountId?: number;

  @Field(() => Int, { description: '카테고리 ID', nullable: true })
  categoryId?: number;

  @Field(() => Int, { description: '상점 ID', nullable: true })
  merchantId?: number;

  @Field(() => String, { description: '상점 이름', nullable: true })
  merchantText?: string;

  @Field(() => String, { description: '메모', nullable: true })
  memo?: string;
}
