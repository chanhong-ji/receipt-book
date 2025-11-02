import { Module } from '@nestjs/common';
import { UserResolver } from './presentation/user.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { UserFactory } from './domain/user.factory';
import { ErrorModule } from 'src/common/error/error.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { CreateUserUsecase } from './domain/usecases/create-user.usecase';
import { LoginUsecase } from './domain/usecases/login.usecase';
import { MeUsecase } from './domain/usecases/me.usecase';
import { FindSummaryUsecase } from 'src/modules/expense/domain/usecases/find-summary.usecase';

@Module({
  imports: [RepositoryModule, ErrorModule, AuthModule],
  providers: [
    UserResolver,
    UserFactory,
    // Usecases
    CreateUserUsecase,
    LoginUsecase,
    MeUsecase,
    FindSummaryUsecase,
  ],
})
export class UserModule {}
