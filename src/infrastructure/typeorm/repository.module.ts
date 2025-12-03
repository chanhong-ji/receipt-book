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
import { TypeormAccountRepository } from './repository/typeorm-account.repository';
import { TypeormBudgetRepository } from './repository/typeorm-budget.repository';
import { TypeormAgentAdviceRepository } from './repository/typeorm-agent-advice.repository';
import { AgentAdviceModel } from './models/agent-advice.model';
import { AgentAdviceRequestModel } from './models/agent-advice-request.model';
import { TypeormAgentAdviceRequestRepository } from './repository/typeorm-agent-advice-request.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      AccountModel,
      CategoryModel,
      ExpenseModel,
      BudgetModel,
      MerchantModel,
      AgentAdviceModel,
      AgentAdviceRequestModel,
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: TypeormUserRepository,
    },
    {
      provide: 'AccountRepository',
      useClass: TypeormAccountRepository,
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
    {
      provide: 'BudgetRepository',
      useClass: TypeormBudgetRepository,
    },
    {
      provide: 'AgentAdviceRepository',
      useClass: TypeormAgentAdviceRepository,
    },
    {
      provide: 'AgentAdviceRequestRepository',
      useClass: TypeormAgentAdviceRequestRepository,
    },
  ],
  exports: [
    'UserRepository', //
    'AccountRepository',
    'CategoryRepository',
    'ExpenseRepository',
    'MerchantRepository',
    'BudgetRepository',
    'AgentAdviceRepository',
    'AgentAdviceRequestRepository',
  ],
})
export class RepositoryModule {}
