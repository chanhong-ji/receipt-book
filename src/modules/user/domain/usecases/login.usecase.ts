import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../application/user.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { ILoginInput } from '../../application/dtos/login.dto';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { User } from '../entity/user.entity';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: ILoginInput): Promise<{ userId: number; token: string }> {
    const user = await this.findUserByEmail(input.email);
    await this.validatePasswordIsCorrect(input.password, user.password);
    const token = await this.jwtService.signAsync({ userId: user.id, username: user.name });
    return { userId: user.id, token };
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.USER_NOT_FOUND));
    }
    return user;
  }

  async validatePasswordIsCorrect(inputPassword: string, userPassword: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(inputPassword, userPassword);
    if (!isPasswordValid) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.PASSWORD_WRONG));
    }
  }
}
