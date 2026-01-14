import { Test } from '@nestjs/testing';
import { UpdateAccountUsecase } from 'src/modules/account/domain/usecases/update-account.usecase';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Account } from 'src/modules/account/domain/entity/account.entity';
import { AccountType } from 'src/modules/user/domain/enum/account.enum';
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

  describe('execute', () => {
    it('성공', async () => {
      // Given
      const user = { id: 1 } as User;
      const existingAccount = Account.create('기존 이름', AccountType.CASH);
      existingAccount.id = 1;

      const input = {
        id: 1,
        name: '새로운 이름',
        type: AccountType.CARD,
        isActive: false,
      };

      repository.findById.mockResolvedValue(existingAccount);
      repository.findAll.mockResolvedValue([]);
      repository.update.mockImplementation((acc) => Promise.resolve(acc));

      // When
      const result = await usecase.execute(input, user);

      // Then
      expect(result.name).toBe(input.name);
      expect(result.type).toBe(input.type);
      expect(result.isActive).toBe(input.isActive);
    });

    it('실패', async () => {
      // Given
      const user = { id: 1 } as User;
      const input = { id: 999, name: 'fail' };
      repository.findById.mockResolvedValue(null);

      // When & Then
      await expect(usecase.execute(input, user)).rejects.toThrow(errorService.get(ErrorCode.ACCOUNT_NOT_FOUND).code);
    });
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
    it('이름이 없으면, 즉시 종료', async () => {
      const result = await usecase.validateDuplicatedName(1, undefined, 1);

      expect(result).toBeUndefined();
    });

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
