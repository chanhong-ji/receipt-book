import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../application/account.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { IDeleteAccountInput } from './../../application/dtos/delete-account.dto';

@Injectable()
export class DeleteAccountUsecase {
  constructor(
    @Inject('AccountRepository') private readonly repository: AccountRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IDeleteAccountInput, user: User): Promise<void> {
    const account = await this.repository.findById(input.id, user.id);
    if (!account) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ACCOUNT_NOT_FOUND));
    }
    await this.repository.delete(input.id);
  }
}
