import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IFindExpenseMonthlyInput, IFindExpenseMonthlyOutput } from '../../application/dtos/find-expense-monthly.dto';
import { ExpenseDto } from './expense.dto';
import { Expense } from '../../domain/entity/expense.entity';
import { Max, Min } from 'class-validator';

@InputType()
export class FindExpenseMonthlyInput implements IFindExpenseMonthlyInput {
  @Field(() => Int, { description: '연도' })
  year: number;

  @Field(() => Int, { description: '월' })
  @Min(1)
  @Max(12)
  month: number;

  @Field(() => [Int], { description: '카테고리 ID', nullable: true })
  categoryIds?: number[];

  @Field(() => [Int], { description: '결제 수단 ID', nullable: true })
  accountIds?: number[];

  @Field(() => Int, { description: '건너뛸 건수' })
  skip: number;

  @Field(() => Int, { description: '조회할 건수' })
  take: number;
}

@ObjectType()
export class FindExpenseMonthlyOutput implements IFindExpenseMonthlyOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [ExpenseDto], { description: '지출 목록', nullable: true })
  expenses: Expense[];

  @Field(() => Int, { description: '총 건수', nullable: true })
  total: number;
}
