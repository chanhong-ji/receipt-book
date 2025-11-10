import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AdviceType } from 'src/infrastructure/typeorm/models/agent-advice.model';
import { AdviceTag } from 'src/infrastructure/typeorm/models/agent-advice.model';

@ObjectType({ isAbstract: true })
export class AdviceDto {
  @Field(() => Int, { description: '조언 ID' })
  id: number;

  @Field(() => String, { description: '조언 내용' })
  adviceText: string;

  @Field(() => AdviceType, { description: '조언 타입' })
  type: AdviceType;

  @Field(() => AdviceTag, { description: '조언 태그', nullable: true })
  tag?: AdviceTag;

  @Field(() => String, { description: '조언 카테고리 이름', nullable: true })
  categoryName?: string;

  @Field(() => String, { description: '조언 기간 시작일', nullable: true })
  periodStart?: string;

  @Field(() => String, { description: '조언 기간 종료일', nullable: true })
  periodEnd?: string;

  @Field(() => Date, { description: '조언 생성 일시', nullable: true })
  createdAt?: Date;

  @Field(() => Date, { description: '조언 수정 일시', nullable: true })
  updatedAt?: Date;
}
