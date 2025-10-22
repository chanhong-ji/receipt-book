import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { UserFactory } from './domain/user.factory';
import { CreateUserUsecase } from './domain/usecases/create-user.usecase';
import { ErrorModule } from 'src/common/error/error.module';

@Module({
  imports: [RepositoryModule, ErrorModule],
  providers: [
    UserResolver,
    UserFactory,
    // Usecases
    CreateUserUsecase,
  ],
})
export class UserModule {}
