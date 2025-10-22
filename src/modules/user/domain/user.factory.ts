import { Injectable } from '@nestjs/common';
import { CreateUserUsecase } from './usecases/create-user.usecase';
import { User } from './entity/user.entity';
import { ICreateUserInput } from '../application/dtos/create-user.dto';

@Injectable()
export class UserFactory {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  createUser(input: ICreateUserInput): Promise<User> {
    return this.createUserUsecase.execute(input);
  }
}
