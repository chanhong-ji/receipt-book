import { Test } from '@nestjs/testing';
import { UpdateAccountUsecase } from 'src/modules/account/domain/usecases/update-account.usecase';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Account } from 'src/modules/account/domain/entity/account.entity';
jest.mock('src/infrastructure/typeorm/repository/typeorm-account.repository');

describe('UpdateAccountUsecase', () => {
  let usecase: UpdateAccountUsecase;
  let repository: Record<keyof AccountRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateAccountUsecase,
        { provide: 'AccountRepository', useClass: TypeormAccountRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(UpdateAccountUsecase);
    repository = moduleRef.get('AccountRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('findAccount', () => {
    it('결제 수단을 찾을 수 없으면, 오류 발생', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(usecase.findAccount(1, { id: 1 } as User)).rejects.toThrow(
        errorService.get(ErrorCode.ACCOUNT_NOT_FOUND).code,
      );
    });
  });

  describe('validateDuplicatedName', () => {
    it('아이디가 다르고, 이름이 동일한 결제 수단이 이미 존재하면, 오류 발생', async () => {
      const existingAccounts = [{ name: 'test', id: 2 } as Account];
      repository.findAll.mockResolvedValue(existingAccounts);

      const newName = 'test';
      const newAccountId = 1;

      await expect(usecase.validateDuplicatedName(1, newName, newAccountId)).rejects.toThrow(
        errorService.get(ErrorCode.ACCOUNT_ALREADY_EXISTS).code,
      );
    });

    it('아이디가 같고, 이름이 동일한 결제 수단이 이미 존재하면, 오류 발생하지 않음', async () => {
      const existingAccounts = [{ name: 'test', id: 1 } as Account];
      repository.findAll.mockResolvedValue(existingAccounts);

      const newName = 'test';
      const newAccountId = 1;

      await expect(usecase.validateDuplicatedName(1, newName, newAccountId)).resolves.not.toThrow();
    });
  });
});
