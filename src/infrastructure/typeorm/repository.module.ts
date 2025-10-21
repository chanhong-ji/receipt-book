import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUserRepository } from './repository/typeorm-user.repository';
import { UserModel } from './models/user.model';
import { AccountModel } from './models/account.model';
import { CategoryModel } from './models/category.model';
import { ExpenseModel } from './models/expense.model';
import { BudgetModel } from './models/budget.model';
import { MerchantModel } from './models/merchant.model';
import { TypeormCategoryRepository } from './repository/typeorm-category.repository';
import { TypeormExpenseRepository } from './repository/typeorm-expense.repository';
import { TypeormMerchantRepository } from './repository/typeorm-merchant.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, AccountModel, CategoryModel, ExpenseModel, BudgetModel, MerchantModel]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeormUserRepository,
    },
    {
      provide: 'CategoryRepository',
      useClass: TypeormCategoryRepository,
    },
    {
      provide: 'ExpenseRepository',
      useClass: TypeormExpenseRepository,
    },
    {
      provide: 'MerchantRepository',
      useClass: TypeormMerchantRepository,
    },
  ],
  exports: ['UserRepository', 'CategoryRepository', 'ExpenseRepository', 'MerchantRepository'],
})
export class RepositoryModule {}
