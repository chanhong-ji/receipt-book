import { Test } from '@nestjs/testing';
import { UpdateExpenseUsecase } from 'src/modules/expense/domain/usecases/update-expense.usecase';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { TypeormExpenseRepository } from 'src/infrastructure/typeorm/repository/typeorm-expense.repository';
import { ErrorService } from 'src/common/error/error.service';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { TypeormMerchantRepository } from 'src/infrastructure/typeorm/repository/typeorm-merchant.repository';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { MerchantRepository } from 'src/modules/merchant/application/merchant.repository';
import { AccountRepository } from 'src/modules/account/application/account.repository';
jest.mock('src/infrastructure/typeorm/repository/typeorm-expense.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-merchant.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-account.repository');

describe('UpdateExpenseUsecase', () => {
  let usecase: UpdateExpenseUsecase;
  let repository: Record<keyof ExpenseRepository, jest.Mock>;
  let categoryRepository: Record<keyof CategoryRepository, jest.Mock>;
  let merchantRepository: Record<keyof MerchantRepository, jest.Mock>;
  let accountRepository: Record<keyof AccountRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateExpenseUsecase,
        { provide: 'ExpenseRepository', useClass: TypeormExpenseRepository },
        { provide: 'CategoryRepository', useClass: TypeormCategoryRepository },
        { provide: 'MerchantRepository', useClass: TypeormMerchantRepository },
        { provide: 'AccountRepository', useClass: TypeormAccountRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(UpdateExpenseUsecase);
    repository = moduleRef.get('ExpenseRepository');
    categoryRepository = moduleRef.get('CategoryRepository');
    merchantRepository = moduleRef.get('MerchantRepository');
    accountRepository = moduleRef.get('AccountRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(merchantRepository).toBeDefined();
    expect(accountRepository).toBeDefined();
    expect(errorService).toBeDefined();
  });
});
