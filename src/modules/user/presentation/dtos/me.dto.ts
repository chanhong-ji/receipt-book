import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IMeOutput } from '../../application/dtos/me.dto';

@ObjectType()
export class MeDto {
  @Field(() => Int, { description: '사용자 ID' })
  id: number;

  @Field(() => String, { description: '이메일' })
  email: string;

  @Field(() => String, { description: '이름' })
  name: string;
}

@ObjectType()
export class MeOutput implements IMeOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => MeDto, { description: '사용자 정보', nullable: true })
  user: MeDto;
}
