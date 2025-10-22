import { Test } from '@nestjs/testing';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { CreateAccountUsecase } from 'src/modules/account/domain/usecases/create-accounts.usecase';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { Account } from 'src/modules/account/domain/entity/account.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
jest.mock('src/infrastructure/typeorm/repository/typeorm-account.repository');

describe('CreateAccountUsecase', () => {
  let usecase: CreateAccountUsecase;
  let repository: Record<keyof AccountRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateAccountUsecase,
        {
          provide: 'AccountRepository',
          useClass: TypeormAccountRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(CreateAccountUsecase);
    repository = moduleRef.get('AccountRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('validateDuplicatedName', () => {
    it('동일한 이름의 결제 수단이 이미 존재하면, 오류 발생', async () => {
      const duplicatedName = 'test';
      const user = { id: 1 } as User;
      repository.findAll.mockResolvedValue([{ name: duplicatedName } as Account]);

      await expect(usecase.validateDuplicatedName(user, duplicatedName)).rejects.toThrow(
        errorService.get(ErrorCode.ACCOUNT_ALREADY_EXISTS).code,
      );
    });
  });
});
