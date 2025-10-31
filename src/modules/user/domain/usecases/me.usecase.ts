import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/user.repository';
import { User } from '../entity/user.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { IMeOutput } from '../../application/dtos/me.dto';

@Injectable()
export class MeUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly repository: UserRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(user: User): Promise<IMeOutput> {
    const foundUser = await this.repository.findById(user.id);
    if (!foundUser) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.USER_NOT_FOUND));
    }
    return {
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      },
    };
  }
}
