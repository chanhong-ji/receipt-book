import { Module } from '@nestjs/common';
import { ExpenseResolver } from './presentation/expense.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [ExpenseResolver],
})
export class ExpenseModule {}
