import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { AccountResolver } from './presentation/account.resolver';
import { Module } from '@nestjs/common';
import { AccountFactory } from './domain/account.factory';
import { FindAccountsUsecase } from './domain/usecases/find-accounts.usecase';
import { CreateAccountUsecase } from './domain/usecases/create-accounts.usecase';
import { UpdateAccountUsecase } from './domain/usecases/update-account.usecase';
import { DeleteAccountUsecase } from './domain/usecases/delete-account.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    AccountResolver,
    AccountFactory,
    // Usecases
    FindAccountsUsecase,
    CreateAccountUsecase,
    UpdateAccountUsecase,
    DeleteAccountUsecase,
  ],
})
export class AccountModule {}
