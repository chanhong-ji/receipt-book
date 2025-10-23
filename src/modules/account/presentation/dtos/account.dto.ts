import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AccountType } from '../../../user/domain/enum/account.enum';

@ObjectType({ isAbstract: true })
export class AccountDto {
  @Field(() => Int, { description: '결제 수단 ID' })
  id: number;

  @Field(() => String, { description: '결제 수단 이름' })
  name: string;

  @Field(() => Boolean, { description: '결제 수단 활성 여부' })
  isActive: boolean;

  @Field(() => AccountType, { description: '결제 수단 타입 (은행 계좌, 현금, 카드, 기타)' })
  type: AccountType;

  @Field(() => Date, { description: '결제 수단 생성 일시' })
  createdAt: Date;

  @Field(() => Date, { description: '결제 수단 수정 일시' })
  updatedAt: Date;
}
