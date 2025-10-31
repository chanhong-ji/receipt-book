import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { ILoginInput, ILoginOutput } from '../application/dtos/login.dto';
import { ICreateUserInput } from '../application/dtos/create-user.dto';
import { IMeOutput } from '../application/dtos/me.dto';
import { CreateUserUsecase } from './usecases/create-user.usecase';
import { LoginUsecase } from './usecases/login.usecase';
import { MeUsecase } from './usecases/me.usecase';

@Injectable()
export class UserFactory {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly loginUsecase: LoginUsecase,
    private readonly meUsecase: MeUsecase,
  ) {}

  createUser(input: ICreateUserInput): Promise<User> {
    return this.createUserUsecase.execute(input);
  }

  login(input: ILoginInput): Promise<ILoginOutput> {
    return this.loginUsecase.execute(input);
  }

  me(user: User): Promise<IMeOutput> {
    return this.meUsecase.execute(user);
  }
}
