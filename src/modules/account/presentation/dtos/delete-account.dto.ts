import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IDeleteAccountInput } from '../../application/dtos/delete-account.dto';
import { IsInt } from 'class-validator';

@InputType()
export class DeleteAccountInput implements IDeleteAccountInput {
  @Field(() => Int, { description: '결제 수단 ID' })
  @IsInt()
  id: number;
}

@ObjectType()
export class DeleteAccountOutput {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
