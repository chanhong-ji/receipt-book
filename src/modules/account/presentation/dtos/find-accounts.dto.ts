import { Field, ObjectType } from '@nestjs/graphql';
import { AccountDto } from './account.dto';

@ObjectType()
export class FindAccountsOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => [AccountDto], { nullable: true, description: '결제 수단 목록' })
  accounts: AccountDto[];
}
