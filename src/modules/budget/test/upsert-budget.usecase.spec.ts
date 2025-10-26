import { Test } from '@nestjs/testing';
import { UpsertBudgetUsecase } from '../domain/usecases/upsert-budget.usecase';
import { BudgetRepository } from '../application/budget.repository';
import { TypeormBudgetRepository } from 'src/infrastructure/typeorm/repository/typeorm-budget.repository';
import { ErrorService } from 'src/common/error/error.service';
jest.mock('src/infrastructure/typeorm/repository/typeorm-budget.repository');

describe('UpsertBudgetUsecase', () => {
  let usecase: UpsertBudgetUsecase;
  let budgetRepository: Record<keyof BudgetRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpsertBudgetUsecase,
        {
          provide: 'BudgetRepository',
          useClass: TypeormBudgetRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(UpsertBudgetUsecase);
    budgetRepository = moduleRef.get('BudgetRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(budgetRepository).toBeDefined();
    expect(errorService).toBeDefined();
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
});
