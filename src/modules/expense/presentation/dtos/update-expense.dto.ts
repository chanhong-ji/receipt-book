import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IUpdateExpenseInput } from '../../application/dtos/update-expense.dto';
import { IsInt } from 'class-validator';
import { ExpenseDto } from './expense.dto';

@InputType()
export class UpdateExpenseInput implements IUpdateExpenseInput {
  @Field(() => Int, { description: '지출 ID' })
  @IsInt()
  id: number;

  @Field(() => String, { description: '지출 이름', nullable: true })
  name?: string;

  @Field(() => Number, { description: '지출 금액', nullable: true })
  amount?: number;

  @Field(() => Date, { description: '지출 날짜', nullable: true })
  postedAt?: Date;

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

@ObjectType()
export class UpdateExpenseOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;

  @Field(() => ExpenseDto, { description: '수정된 지출', nullable: true })
  expense?: ExpenseDto;
}
