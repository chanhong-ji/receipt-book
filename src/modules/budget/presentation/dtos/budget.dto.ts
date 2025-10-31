import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CategoryDto } from 'src/modules/category/presentation/dtos/category.dto';

@ObjectType({ isAbstract: true })
export class BudgetDto {
  @Field(() => Int, { description: '예산 ID' })
  id: number;

  @Field(() => String, { description: '년월' })
  yearMonth: string;

  @Field(() => Number, { description: '예산 금액' })
  totalAmount: number;

  @Field(() => CategoryDto, { description: '카테고리', nullable: true })
  category?: CategoryDto;
}
