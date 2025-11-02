import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IFindSummaryInput, IFindSummaryOutput } from '../../application/dtos/find-summary.dto';
import { CategoryDto } from 'src/modules/category/presentation/dtos/category.dto';
import { Category } from 'src/modules/category/domain/entity/category.entity';
import { IsInt, Max, Min } from 'class-validator';

@ObjectType()
export class SummaryDto {
  @Field(() => Number, { description: '지난 달 지출' })
  lastMonthExpense: number;

  @Field(() => Number, { description: '이번 달 지출' })
  thisMonthExpense: number;

  @Field(() => [CategoryDto], { description: '카테고리 목록' })
  topCategory: Category[];
}

@InputType()
export class FindSummaryInput implements IFindSummaryInput {
  @Field(() => Int, { description: '이번 연도' })
  @IsInt()
  @Min(2000)
  @Max(2100)
  thisYear: number;

  @Field(() => Int, { description: '이번 월' })
  @IsInt()
  @Min(1)
  @Max(12)
  thisMonth: number;
}

@ObjectType()
export class FindSummaryOutput implements IFindSummaryOutput {
  @Field(() => SummaryDto, { description: '요약 정보', nullable: true })
  summary: SummaryDto;

  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
