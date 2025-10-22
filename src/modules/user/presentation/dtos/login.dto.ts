import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { ILoginInput, ILoginOutput } from '../../application/dtos/login.dto';

@InputType()
export class LoginInput implements ILoginInput {
  @Field(() => String, { description: '이메일' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: '비밀번호' })
  @IsString()
  password: string;
}

@ObjectType()
export class LoginOutput implements ILoginOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Int, { description: '사용자 ID', nullable: true })
  userId: number;

  @Field(() => String, { description: '토큰', nullable: true })
  token: string;
}
