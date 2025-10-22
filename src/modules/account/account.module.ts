import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { AccountResolver } from './presentation/account.resolver';
import { Module } from '@nestjs/common';
import { AccountFactory } from './domain/account.factory';
import { FindAccountsUsecase } from './domain/usecases/find-accounts.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    AccountResolver,
    AccountFactory,
    // Usecases
    FindAccountsUsecase,
  ],
})
export class AccountModule {}
