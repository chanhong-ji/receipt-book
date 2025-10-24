import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IDeleteExpenseInput } from '../../application/dtos/delete-expense.dto';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteExpenseInput implements IDeleteExpenseInput {
  @Field(() => Int, { description: '지출 ID' })
  @IsInt()
  id: number;
}

@ObjectType()
export class DeleteExpenseOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
