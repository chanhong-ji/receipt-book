import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateAgentAdviceOutput {
  @Field(() => Boolean, { description: '성공 여부' })
  ok: boolean;

  @Field(() => String, { description: '에러 메시지', nullable: true })
  error?: string;
}
