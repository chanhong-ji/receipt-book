import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ICreateUserInput } from '../../application/dtos/create-user.dto';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput implements ICreateUserInput {
  @Field(() => String, { description: '이메일' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: '비밀번호' })
  @IsString()
  password: string;

  @Field(() => String, { description: '이름' })
  @IsString()
  name: string;
}

@ObjectType()
export class CreateUserOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Int, { description: '생성된 유저 아이디', nullable: true })
  userId?: number;
}
