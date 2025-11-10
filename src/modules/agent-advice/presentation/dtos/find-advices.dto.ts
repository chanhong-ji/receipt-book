import { Field, ObjectType } from '@nestjs/graphql';
import { IFindAdvicesOutput } from '../../application/dtos/find-advices.dto';
import { AdviceDto } from './advice.dto';
import { AgentAdvice } from '../../domain/entity/agent-advice.entity';

@ObjectType()
export class FindAdvicesOutput implements IFindAdvicesOutput {
  @Field(() => [AdviceDto], { nullable: true, description: '조언 목록' })
  advices: AgentAdvice[];

  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { nullable: true, description: '에러 메시지' })
  error?: string;
}
