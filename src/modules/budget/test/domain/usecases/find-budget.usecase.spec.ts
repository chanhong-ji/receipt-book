import { Test } from '@nestjs/testing';
import { FindBudgetUsecase } from '../../../domain/usecases/find-budget.usecase';
import { BudgetRepository } from '../../../application/budget.repository';
import { TypeormBudgetRepository } from 'src/infrastructure/typeorm/repository/typeorm-budget.repository';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';

jest.mock('src/infrastructure/typeorm/repository/typeorm-budget.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('FindBudgetUsecase', () => {
  let usecase: FindBudgetUsecase;
  let budgetRepository: Record<keyof BudgetRepository, jest.Mock>;
  let categoryRepository: Record<keyof CategoryRepository, jest.Mock>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindBudgetUsecase,
        {
          provide: 'BudgetRepository',
          useClass: TypeormBudgetRepository,
        },
        {
          provide: 'CategoryRepository',
          useClass: TypeormCategoryRepository,
        },
      ],
    }).compile();

    usecase = moduleRef.get(FindBudgetUsecase);
    budgetRepository = moduleRef.get('BudgetRepository');
    categoryRepository = moduleRef.get('CategoryRepository');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(budgetRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('execute', () => {
    it('성공: “매핑 결과가 budgets에 반영되어 반환된다”', async () => {
      const input = { year: 2025, month: 1 };
      const user = { id: 1 } as User;

      const budgets = [
        { id: 1, category: { id: 10 } },
        { id: 2, category: { id: 20 } },
      ] as any[];
      const categories = [
        { id: 10, totalExpense: 111, name: 'cat-10' },
        { id: 20, totalExpense: 222, name: 'cat-20' },
      ] as any[];

      budgetRepository.findManyByYearMonth.mockResolvedValue(budgets);
      categoryRepository.findAllWithTotalExpense.mockResolvedValue(categories);

      const result = await usecase.execute(input, user);

      // repository 호출 여부는 최소만 검증
      expect(budgetRepository.findManyByYearMonth).toHaveBeenCalledWith('2025-01-01', user);
      expect(categoryRepository.findAllWithTotalExpense).toHaveBeenCalledWith(user.id, 2025, 1);

      // 핵심: 반환 budgets에 매핑 결과가 반영되어 있음
      expect(result).toEqual({ budgets });
      expect(result.budgets[0].category).toEqual(categories[0]);
      expect(result.budgets[0].totalExpense).toBe(111);
      expect(result.budgets[1].category).toEqual(categories[1]);
      expect(result.budgets[1].totalExpense).toBe(222);
    });

    it('budgets가 빈 배열이면 빈 배열 반환 + 매핑에서 터지지 않음', async () => {
      const input = { year: 2025, month: 1 };
      const user = { id: 1 } as User;

      const budgets: any[] = [];
      const categories = [{ id: 10, totalExpense: 999 }] as any[];

      budgetRepository.findManyByYearMonth.mockResolvedValue(budgets);
      categoryRepository.findAllWithTotalExpense.mockResolvedValue(categories);

      const result = await usecase.execute(input, user);

      expect(result).toEqual({ budgets: [] });
    });

    it('categories가 빈 배열이면 매핑 없음 처리(지출 0)', async () => {
      const input = { year: 2025, month: 1 };
      const user = { id: 1 } as User;

      const budgets = [
        { id: 1, category: { id: 10 } },
        { id: 2, category: { id: 20 } },
      ] as any[];
      const categories: any[] = [];

      budgetRepository.findManyByYearMonth.mockResolvedValue(budgets);
      categoryRepository.findAllWithTotalExpense.mockResolvedValue(categories);

      const result = await usecase.execute(input, user);

      expect(result).toEqual({ budgets });
      expect(result.budgets[0].category).toBeUndefined();
      expect(result.budgets[0].totalExpense).toBe(0);
      expect(result.budgets[1].category).toBeUndefined();
      expect(result.budgets[1].totalExpense).toBe(0);
    });
  });

  describe('formatYearMonth', () => {
    it('year=2025, month=1 일 때, 2025-01-01 을 반환한다', () => {
      const result = usecase.formatYearMonth(2025, 1);
      expect(result).toBe('2025-01-01');
    });

    it('year=2025, month=12 일 때, 2025-12-01 을 반환한다', () => {
      const result = usecase.formatYearMonth(2025, 12);
      expect(result).toBe('2025-12-01');
    });
  });

  describe('mapCategoryToBudget', () => {
    it('budgets 의 category 와 categories 의 id 가 일치하면, budgets 의 category 와 totalExpense 를 매핑한다', () => {
      const budgets = [{ category: { id: 10 } }] as any[];
      const categories = [{ id: 10, totalExpense: 1234 }] as any[];

      usecase.mapCategoryToBudget(budgets, categories);

      expect(budgets[0].category).toEqual(categories[0]);
      expect(budgets[0].totalExpense).toBe(1234);
    });

    it('budgets 의 category 와 categories 의 id 가 일치하지 않으면, budgets 의 category = undefined, totalExpense = 0 으로 매핑한다', () => {
      const budgets = [{ category: { id: 10 } }] as any[];
      const categories = [{ id: 20, totalExpense: 1234 }] as any[];

      usecase.mapCategoryToBudget(budgets, categories);

      expect(budgets[0].category).toBeUndefined();
      expect(budgets[0].totalExpense).toBe(0);
    });
  });
});
