import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { BudgetResolver } from './presentation/budget.resolver';
import { BudgetFactory } from './domain/budget.factory';

@Module({
  imports: [RepositoryModule],
  providers: [BudgetResolver, BudgetFactory],
})
export class BudgetModule {}
