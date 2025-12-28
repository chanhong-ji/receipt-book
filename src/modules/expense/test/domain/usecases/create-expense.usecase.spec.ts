import { Test } from '@nestjs/testing';
import { CreateExpenseUsecase } from 'src/modules/expense/domain/usecases/create-expense.usecase';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { TypeormExpenseRepository } from 'src/infrastructure/typeorm/repository/typeorm-expense.repository';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { MerchantRepository } from 'src/modules/merchant/application/merchant.repository';
import { TypeormMerchantRepository } from 'src/infrastructure/typeorm/repository/typeorm-merchant.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { User } from 'src/modules/user/domain/entity/user.entity';

jest.mock('src/infrastructure/typeorm/repository/typeorm-expense.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-merchant.repository');

describe('CreateExpenseUsecase', () => {
  let usecase: CreateExpenseUsecase;
  let expenseRepository: Record<keyof ExpenseRepository, jest.Mock>;
  let categoryRepository: Record<keyof CategoryRepository, jest.Mock>;
  let merchantRepository: Record<keyof MerchantRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateExpenseUsecase,
        { provide: 'ExpenseRepository', useClass: TypeormExpenseRepository },
        { provide: 'CategoryRepository', useClass: TypeormCategoryRepository },
        { provide: 'MerchantRepository', useClass: TypeormMerchantRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(CreateExpenseUsecase);
    expenseRepository = moduleRef.get('ExpenseRepository');
    categoryRepository = moduleRef.get('CategoryRepository');
    merchantRepository = moduleRef.get('MerchantRepository');
    errorService = moduleRef.get(ErrorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(merchantRepository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('execute', () => {
    it('성공 - validate를 통과하면 expenseRepository.save 를 호출하고 Expense 를 반환한다', async () => {
      const user = { id: 1 } as User;
      const input = {
        name: '점심',
        amount: 12000,
        postedAt: new Date('2025-01-01'),
        accountId: 1,
        categoryId: 10,
        merchantId: 20,
        merchantText: '스타벅스',
        memo: '메모',
      };

      categoryRepository.findById.mockResolvedValue({ id: 10 } as any);
      merchantRepository.findById.mockResolvedValue({ id: 20 } as any);
      expenseRepository.save.mockImplementation((expense) => Promise.resolve(expense));

      const result = await usecase.execute(input, user);

      expect(result.name).toBe(input.name);
      expect(result.amount).toBe(input.amount);
      expect(result.accountId).toBe(input.accountId);
      expect(expenseRepository.save).toHaveBeenCalled();
    });
  });

  describe('validate', () => {
    it('categoryId가 있는데 카테고리가 없으면 CATEGORY_NOT_FOUND 에러를 던진다', async () => {
      const user = { id: 1 } as User;
      const input = { categoryId: 10, merchantId: undefined } as any;
      categoryRepository.findById.mockResolvedValue(null);

      await expect(usecase.validate(input, user)).rejects.toThrow(
        new CustomGraphQLError(errorService.get(ErrorCode.CATEGORY_NOT_FOUND)),
      );
    });

    it('merchantId가 있는데 가맹점이 없으면 MERCHANT_NOT_FOUND 에러를 던진다', async () => {
      const user = { id: 1 } as User;
      const input = { merchantId: 20, categoryId: undefined } as any;
      merchantRepository.findById.mockResolvedValue(null);

      await expect(usecase.validate(input, user)).rejects.toThrow(
        new CustomGraphQLError(errorService.get(ErrorCode.MERCHANT_NOT_FOUND)),
      );
    });
  });
});
