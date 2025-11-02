import { Module } from '@nestjs/common';
import { ExpenseResolver } from './presentation/expense.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { ExpenseFactory } from './domain/expense.factory';
import { CreateExpenseUsecase } from './domain/usecases/create-expense.usecase';
import { UpdateExpenseUsecase } from './domain/usecases/update-expense.usecase';
import { DeleteExpenseUsecase } from './domain/usecases/delete-expense.usecase';
import { FindExpenseMonthlyUsecase } from './domain/usecases/find-expense-monthly.usecase';
import { FindMonthlyExpenseTotalUsecase } from './domain/usecases/find-monthly-expense-total.usecase';
import { FindCategoryMonthlyExpenseUsecase } from './domain/usecases/find-category-monthly-expense.usecase';
import { FindSummaryUsecase } from './domain/usecases/find-summary.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    ExpenseResolver,
    ExpenseFactory,
    // Usecases
    CreateExpenseUsecase,
    UpdateExpenseUsecase,
    DeleteExpenseUsecase,
    FindExpenseMonthlyUsecase,
    FindMonthlyExpenseTotalUsecase,
    FindCategoryMonthlyExpenseUsecase,
    FindSummaryUsecase,
  ],
})
export class ExpenseModule {}
