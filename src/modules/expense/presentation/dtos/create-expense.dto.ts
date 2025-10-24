import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ICreateExpenseInput } from '../../application/dtos/create-expense.dto';
import { ExpenseDto } from './expense.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateExpenseInput implements ICreateExpenseInput {
  @Field(() => String, { description: '지출 이름' })
  name: string;

  @Field(() => Number, { description: '지출 금액' })
  @Min(0)
  amount: number;

  @Field(() => Date, { description: '지출 날짜' })
  postedAt: Date;

  @Field(() => Int, { description: '결제 수단 ID' })
  @IsInt()
  accountId: number;

  @Field(() => Int, { description: '카테고리 ID', nullable: true })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @Field(() => Int, { description: '상점 ID', nullable: true })
  @IsOptional()
  @IsInt()
  merchantId?: number;

  @Field(() => String, { description: '상점 이름', nullable: true })
  merchantText?: string;

  @Field(() => String, { description: '메모', nullable: true })
  memo?: string;
}

@ObjectType()
export class CreateExpenseOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;

  @Field(() => ExpenseDto, { description: '지출 내역', nullable: true })
  expense?: ExpenseDto;
}
