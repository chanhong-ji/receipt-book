import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsInt } from 'class-validator';
import {
  IFindCategoryMonthlyExpenseInput,
  IFindCategoryMonthlyExpenseOutput,
} from '../../application/dtos/find-category-monthly-expense.dto';

@InputType()
export class FindCategoryMonthlyExpenseInput implements IFindCategoryMonthlyExpenseInput {
  @Field(() => Int, { description: '연도' })
  year: number;

  @Field(() => [Int], { description: '월 목록' })
  @IsArray()
  @IsInt({ each: true })
  months: number[];
}

@ObjectType()
export class CategoryExpense {
  @Field(() => Int, { description: '카테고리 ID' })
  categoryId: number;

  @Field(() => Number, { description: '총 지출' })
  totalExpense: number;
}

@ObjectType()
export class FindCategoryMonthlyExpenseOutput implements IFindCategoryMonthlyExpenseOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [CategoryExpense], { nullable: true })
  result: CategoryExpense[];
}
