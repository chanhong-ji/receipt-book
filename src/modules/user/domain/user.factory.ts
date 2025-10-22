import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { ILoginInput, ILoginOutput } from '../application/dtos/login.dto';
import { ICreateUserInput } from '../application/dtos/create-user.dto';
import { CreateUserUsecase } from './usecases/create-user.usecase';
import { LoginUsecase } from './usecases/login.usecase';

@Injectable()
export class UserFactory {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly loginUsecase: LoginUsecase,
  ) {}

  createUser(input: ICreateUserInput): Promise<User> {
    return this.createUserUsecase.execute(input);
  }

  login(input: ILoginInput): Promise<ILoginOutput> {
    return this.loginUsecase.execute(input);
  }
}
