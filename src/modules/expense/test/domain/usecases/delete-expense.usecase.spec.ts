import { Test } from '@nestjs/testing';
import { DeleteExpenseUsecase } from 'src/modules/expense/domain/usecases/delete-expense.usecase';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { TypeormExpenseRepository } from 'src/infrastructure/typeorm/repository/typeorm-expense.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { User } from 'src/modules/user/domain/entity/user.entity';

jest.mock('src/infrastructure/typeorm/repository/typeorm-expense.repository');

describe('DeleteExpenseUsecase', () => {
  let usecase: DeleteExpenseUsecase;
  let repository: Record<keyof ExpenseRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteExpenseUsecase,
        { provide: 'ExpenseRepository', useClass: TypeormExpenseRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(DeleteExpenseUsecase);
    repository = moduleRef.get('ExpenseRepository');
    errorService = moduleRef.get(ErrorService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('execute', () => {
    it('지출이 존재하지 않으면 EXPENSE_NOT_FOUND 에러를 던진다', async () => {
      const user = { id: 1 } as User;
      repository.findById.mockResolvedValue(null);

      await expect(usecase.execute({ id: 1 }, user)).rejects.toThrow(
        new CustomGraphQLError(errorService.get(ErrorCode.EXPENSE_NOT_FOUND)),
      );
    });

    it('지출이 존재하면 delete 를 호출한다', async () => {
      const user = { id: 1 } as User;
      repository.findById.mockResolvedValue({ id: 1 } as any);
      repository.delete.mockResolvedValue(undefined);

      await usecase.execute({ id: 1 }, user);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
