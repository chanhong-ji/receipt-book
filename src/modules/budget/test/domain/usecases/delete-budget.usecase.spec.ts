import { Test } from '@nestjs/testing';
import { DeleteBudgetUsecase } from '../../../domain/usecases/delete-budget.usecase';
import { BudgetRepository } from '../../../application/budget.repository';
import { TypeormBudgetRepository } from 'src/infrastructure/typeorm/repository/typeorm-budget.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';

jest.mock('src/infrastructure/typeorm/repository/typeorm-budget.repository');

describe('DeleteBudgetUsecase', () => {
  let usecase: DeleteBudgetUsecase;
  let budgetRepository: Record<keyof BudgetRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteBudgetUsecase,
        {
          provide: 'BudgetRepository',
          useClass: TypeormBudgetRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(DeleteBudgetUsecase);
    budgetRepository = moduleRef.get('BudgetRepository');
    errorService = moduleRef.get(ErrorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(budgetRepository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('execute', () => {
    it('예산이 존재하지 않으면 BUDGET_NOT_FOUND 에러를 던진다', async () => {
      const user = { id: 1 } as User;
      budgetRepository.findById.mockResolvedValue(null);

      await expect(usecase.execute({ id: 1 }, user)).rejects.toThrow(
        new CustomGraphQLError(errorService.get(ErrorCode.BUDGET_NOT_FOUND)),
      );
    });

    it('예산이 존재하면 delete 를 호출한다', async () => {
      const user = { id: 1 } as User;
      budgetRepository.findById.mockResolvedValue({ id: 1 } as any);
      budgetRepository.delete.mockResolvedValue(undefined);

      await usecase.execute({ id: 1 }, user);

      expect(budgetRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
