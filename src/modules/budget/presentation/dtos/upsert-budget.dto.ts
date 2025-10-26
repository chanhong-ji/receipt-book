import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../../application/dtos/upsert-budget.dto';
import { Budget } from '../../domain/entity/budget.entity';
import { BudgetDto } from './budget.dto';

@InputType()
export class UpsertBudgetInput implements IUpsertBudgetInput {
  @Field(() => Int, { description: '년' })
  year: number;

  @Field(() => Int, { description: '월' })
  month: number;

  @Field(() => Number, { description: '예산 금액' })
  totalAmount: number;
}

@ObjectType()
export class UpsertBudgetOutput implements IUpsertBudgetOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;

  @Field(() => BudgetDto, { description: '예산', nullable: true })
  budget: Budget;
}
