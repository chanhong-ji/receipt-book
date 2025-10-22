import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { User } from '../entity/user.entity';
import { UserRepository } from '../../application/user.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { ICreateUserInput } from '../../application/dtos/create-user.dto';

@Injectable()
export class CreateUserUsecase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: ICreateUserInput): Promise<User> {
    await this.validateEmailDuplicate(input.email);
    return this.createUser(input);
  }

  async validateEmailDuplicate(email: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.EMAIL_ALREADY_EXISTS));
    }
  }

  async createUser(input: ICreateUserInput) {
    const hashedPassword = await this.createHashedPassword(input.password);
    const user = User.create(input.email, input.name, hashedPassword);
    return this.userRepository.save(user);
  }

  createHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.configService.get('auth.bcrypt.salt'));
  }
}
