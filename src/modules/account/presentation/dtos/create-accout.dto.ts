import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ICreateAccountInput } from '../../application/dtos/create-account.dto';
import { IsString } from 'class-validator';
import { AccountType } from 'src/modules/user/domain/enum/account.enum';
import { AccountDto } from './account.dto';

@InputType()
export class CreateAccountInput implements ICreateAccountInput {
  @Field(() => String, { description: '결제 수단 이름' })
  @IsString()
  name: string;

  @Field(() => AccountType, { description: '결제 수단 타입' })
  type: AccountType;
}

@ObjectType()
export class CreateAccountOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => AccountDto, { nullable: true })
  account?: AccountDto;
}
