import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { BudgetResolver } from './presentation/budget.resolver';
import { BudgetFactory } from './domain/budget.factory';
import { UpsertBudgetUsecase } from './domain/usecases/upsert-budget.usecase';
import { DeleteBudgetUsecase } from './domain/usecases/delete-budget.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    BudgetResolver,
    BudgetFactory,
    // Usecases
    UpsertBudgetUsecase,
    DeleteBudgetUsecase,
  ],
})
export class BudgetModule {}
