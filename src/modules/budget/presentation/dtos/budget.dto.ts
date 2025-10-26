import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class BudgetDto {
  @Field(() => Int, { description: '예산 ID' })
  id: number;

  @Field(() => String, { description: '년월' })
  yearMonth: string;

  @Field(() => Number, { description: '예산 금액' })
  totalAmount: number;
}
