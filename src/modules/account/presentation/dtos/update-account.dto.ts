import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IUpdateAccountInput } from '../../application/dtos/update-account.dto';
import { AccountType } from 'src/modules/user/domain/enum/account.enum';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountDto } from './account.dto';

@InputType()
export class UpdateAccountInput implements IUpdateAccountInput {
  @Field(() => Int, { description: '결제 수단 ID' })
  id: number;

  @Field(() => String, { description: '결제 수단 이름', nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => AccountType, { description: '결제 수단 타입', nullable: true })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @Field(() => Boolean, { description: '결제 수단 활성 여부', nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ObjectType()
export class UpdateAccountOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => AccountDto, { nullable: true })
  account?: AccountDto;
}
