import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IDeleteBudgetInput } from '../../application/dtos/delete-budget.dto';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteBudgetInput implements IDeleteBudgetInput {
  @Field(() => Int, { description: '예산 ID' })
  @IsInt()
  id: number;
}

@ObjectType()
export class DeleteBudgetOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;
}
