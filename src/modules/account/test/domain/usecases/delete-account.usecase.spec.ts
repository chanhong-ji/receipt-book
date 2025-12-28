import { Test } from '@nestjs/testing';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { DeleteAccountUsecase } from 'src/modules/account/domain/usecases/delete-account.usecase';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';

jest.mock('src/infrastructure/typeorm/repository/typeorm-account.repository');

describe('DeleteAccountUsecase', () => {
  let usecase: DeleteAccountUsecase;
  let repository: Record<keyof AccountRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteAccountUsecase,
        {
          provide: 'AccountRepository',
          useClass: TypeormAccountRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(DeleteAccountUsecase);
    repository = moduleRef.get('AccountRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('execute', () => {
    it('계좌가 존재하지 않으면 ACCOUNT_NOT_FOUND 에러를 던진다', async () => {
      const user = { id: 1 } as User;
      repository.findById.mockResolvedValue(null);

      await expect(usecase.execute({ id: 1 }, user)).rejects.toThrow(
        new CustomGraphQLError(errorService.get(ErrorCode.ACCOUNT_NOT_FOUND)),
      );
    });
  });
});
