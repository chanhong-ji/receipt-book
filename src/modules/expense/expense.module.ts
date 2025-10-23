import { Module } from '@nestjs/common';
import { ExpenseResolver } from './presentation/expense.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { ExpenseFactory } from './domain/expense.factory';
import { CreateExpenseUsecase } from './domain/usecases/create-expense.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    ExpenseResolver,
    ExpenseFactory,
    // Usecases
    CreateExpenseUsecase,
  ],
})
export class ExpenseModule {}
