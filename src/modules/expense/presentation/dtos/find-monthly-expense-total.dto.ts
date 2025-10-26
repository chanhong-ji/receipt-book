import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsInt } from 'class-validator';
import {
  IFindMonthlyExpenseTotalInput,
  IFindMonthlyExpenseTotalOutput,
} from '../../application/dtos/find-monthly-expense-total.dto';

@InputType()
export class FindMonthlyExpenseTotalInput implements IFindMonthlyExpenseTotalInput {
  @Field(() => Int, { description: '연도' })
  year: number;

  @Field(() => [Int], { description: '월' })
  @IsArray()
  @IsInt({ each: true })
  months: number[];
}

@ObjectType()
export class MonthlyExpenseTotalDto {
  @Field(() => Int, { description: '월' })
  month: number;

  @Field(() => Number, { description: '지출 합계' })
  totalExpense: number;
}

@ObjectType()
export class FindMonthlyExpenseTotalOutput implements IFindMonthlyExpenseTotalOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [MonthlyExpenseTotalDto], { description: '월별 지출 합계 목록', nullable: true })
  months: MonthlyExpenseTotalDto[];
}
