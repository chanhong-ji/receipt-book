import { Test } from '@nestjs/testing';
import { UpsertBudgetUsecase } from 'src/modules/budget/domain/usecases/upsert-budget.usecase';
import { BudgetRepository } from 'src/modules/budget/application/budget.repository';
import { TypeormBudgetRepository } from 'src/infrastructure/typeorm/repository/typeorm-budget.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { Budget } from 'src/modules/budget/domain/entity/budget.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
jest.mock('src/infrastructure/typeorm/repository/typeorm-budget.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('UpsertBudgetUsecase', () => {
  let usecase: UpsertBudgetUsecase;
  let budgetRepository: Record<keyof BudgetRepository, jest.Mock>;
  let categoryRepository: Record<keyof CategoryRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpsertBudgetUsecase,
        {
          provide: 'BudgetRepository',
          useClass: TypeormBudgetRepository,
        },
        {
          provide: 'CategoryRepository',
          useClass: TypeormCategoryRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(UpsertBudgetUsecase);
    budgetRepository = moduleRef.get('BudgetRepository');
    categoryRepository = moduleRef.get('CategoryRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(budgetRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('성공 - 기존 예산이 없으면 새로 생성한다', async () => {
      const user = { id: 1 } as User;
      const input = { year: 2025, month: 1, totalAmount: 10000, categoryId: 1 };
      const category = { id: 1, name: '식비' };
      const newBudget = { id: 1, ...input } as any;

      categoryRepository.findById.mockResolvedValue(category);
      budgetRepository.findByCategory.mockResolvedValue(null);
      budgetRepository.create.mockResolvedValue(newBudget);

      const result = await usecase.execute(input, user);

      expect(result.budget).toBeDefined();
      expect(budgetRepository.create).toHaveBeenCalled();
      expect(budgetRepository.update).not.toHaveBeenCalled();
    });

    it('성공 - 기존 예산이 있으면 업데이트한다', async () => {
      const user = { id: 1 } as User;
      const input = { year: 2025, month: 1, totalAmount: 20000, categoryId: 1 };
      const category = { id: 1, name: '식비' };
      const existingBudget = { id: 1, totalAmount: 10000 } as Budget;

      categoryRepository.findById.mockResolvedValue(category);
      budgetRepository.findByCategory.mockResolvedValue(existingBudget);
      budgetRepository.update.mockResolvedValue({ ...existingBudget, totalAmount: input.totalAmount });

      const result = await usecase.execute(input, user);

      expect(result.budget.totalAmount).toBe(input.totalAmount);
      expect(budgetRepository.update).toHaveBeenCalled();
      expect(budgetRepository.create).not.toHaveBeenCalled();
    });

    it('실패 - 카테고리가 없으면 예외를 던진다', async () => {
      const user = { id: 1 } as User;
      const input = { year: 2025, month: 1, totalAmount: 10000, categoryId: 999 };

      categoryRepository.findById.mockResolvedValue(null);

      await expect(usecase.execute(input, user)).rejects.toThrow(errorService.get(ErrorCode.CATEGORY_NOT_FOUND).code);
    });
  });

  describe('formatYearMonth', () => {
    it('연도와 월을 받아, 연도-월-01 형식의 문자열을 반환한다.', () => {
      const year = 2025;
      const month = 1;

      const result = usecase.formatYearMonth(year, month);

      expect(result).toBe('2025-01-01');
    });

    it('연도와 월을 받아, 연도-월-01 형식의 문자열을 반환한다.', () => {
      const year = 2025;
      const month = 11;

      const result = usecase.formatYearMonth(year, month);

      expect(result).toBe('2025-11-01');
    });
  });

  describe('updateBudget', () => {
    it('budget 를 업데이트한다', async () => {
      const budget = { id: 1, totalAmount: 1000 } as Budget;
      const totalAmount = 2000;

      const result = await usecase.updateBudget(budget, totalAmount);

      expect(result.totalAmount).toBe(totalAmount);
    });
  });

  describe('validateCategory', () => {
    it('category 가 존재하지 않으면, 에러를 던진다', async () => {
      const categoryId = 1;
      const user = { id: 1 } as User;

      categoryRepository.findById.mockResolvedValue(null);

      await expect(usecase.validateCategory(categoryId, user)).rejects.toThrow(
        errorService.get(ErrorCode.CATEGORY_NOT_FOUND).code,
      );
    });
  });
});
