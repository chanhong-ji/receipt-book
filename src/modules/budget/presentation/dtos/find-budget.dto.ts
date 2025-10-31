import { IsArray, IsInt } from 'class-validator';
import { IFindBudgetInput, IFindBudgetOutput } from '../../application/dtos/find-budget.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BudgetDto } from './budget.dto';
import { Budget } from '../../domain/entity/budget.entity';

@InputType()
export class FindBudgetInput implements IFindBudgetInput {
  @Field(() => Int, { description: '연도' })
  @IsInt()
  year: number;

  @Field(() => [Int], { description: '월' })
  @IsInt({ each: true })
  @IsArray()
  months: number[];
}

@ObjectType()
export class FindBudgetOutput implements IFindBudgetOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;

  @Field(() => [BudgetDto], { description: '예산 목록', nullable: true })
  budgets: Budget[];
}
