import { Test } from '@nestjs/testing';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { FindAccountsUsecase } from 'src/modules/account/domain/usecases/find-accounts.usecase';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
jest.mock('src/infrastructure/typeorm/repository/typeorm-account.repository');

describe('FindAccountsUsecase', () => {
  let usecase: FindAccountsUsecase;
  let repository: Record<keyof AccountRepository, jest.Mock>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAccountsUsecase,
        {
          provide: 'AccountRepository',
          useClass: TypeormAccountRepository,
        },
      ],
    }).compile();

    usecase = moduleRef.get(FindAccountsUsecase);
    repository = moduleRef.get('AccountRepository');
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
  });
});
