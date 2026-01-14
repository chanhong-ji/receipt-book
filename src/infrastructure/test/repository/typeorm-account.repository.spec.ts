import { Test, TestingModule } from '@nestjs/testing';
import { createTestTypeormModule } from '../utils/test-typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeormAccountRepository } from 'src/infrastructure/typeorm/repository/typeorm-account.repository';
import { AccountModel } from 'src/infrastructure/typeorm/models/account.model';
import { UserModel } from 'src/infrastructure/typeorm/models/user.model';
import { createTestUser } from '../utils/helper/user.helper';
import { createTestAccount } from '../utils/helper/account.helper';
import { Account } from 'src/modules/account/domain/entity/account.entity';
import { AccountType } from 'src/modules/user/domain/enum/account.enum';

describe('TypeormAccountRepository', () => {
  let repository: TypeormAccountRepository;
  let database: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [createTestTypeormModule(), TypeOrmModule.forFeature([AccountModel, UserModel])],
      providers: [
        {
          provide: 'AccountRepository',
          useClass: TypeormAccountRepository,
        },
      ],
    }).compile();

    database = module.get(DataSource);
    repository = module.get('AccountRepository');
  });

  describe('findAll', () => {
    it('userId로 계좌를 조회하면 -> 계좌 배열을 반환한다.', async () => {
      const userId = await createTestUser(database);
      await createTestAccount(database, userId);

      const accounts = await repository.findAll(userId);

      expect(accounts).toHaveLength(1);
    });

    it('계좌가 없는 경우 -> 빈 배열을 반환한다', async () => {
      const userId = await createTestUser(database);
      const accounts = await repository.findAll(userId);

      expect(accounts).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('userId로 계좌를 조회하면 -> 계좌를 반환한다.', async () => {
      const userId = await createTestUser(database);
      const accountId = await createTestAccount(database, userId);

      const foundAccount = await repository.findById(accountId, userId);

      expect(foundAccount).toBeDefined();
    });

    it('계좌가 없는 경우 -> null을 반환한다', async () => {
      const userId = await createTestUser(database);

      const foundAccount = await repository.findById(999999, userId);

      expect(foundAccount).toBeNull();
    });
  });

  describe('update', () => {
    it('계좌를 업데이트하면 -> 업데이트된 계좌를 반환한다.', async () => {
      const userId = await createTestUser(database);
      const existingAccountId = await createTestAccount(database, userId);
      const updatedAccount = Account.create('updatedName', AccountType.CARD);
      updatedAccount.id = existingAccountId;

      const result = await repository.update(updatedAccount);

      expect(result).toBeDefined();
      expect(result.name).toBe('updatedName');
      expect(result.type).toBe(AccountType.CARD);
    });
  });

  describe('save', () => {
    it('계좌를 저장하면 -> 저장된 계좌를 반환한다.', async () => {
      const userId = await createTestUser(database);
      const newAccount = Account.create('newAccount', AccountType.CARD);

      const savedAccount = await repository.save(newAccount, userId);

      expect(savedAccount).toBeDefined();
      expect(savedAccount.name).toBe('newAccount');
      expect(savedAccount.type).toBe(AccountType.CARD);
    });
  });

  describe('delete', () => {
    it('계좌를 삭제한다', async () => {
      const userId = await createTestUser(database);
      const accountId = await createTestAccount(database, userId);

      await repository.delete(accountId);

      const deletedAccount = await database.getRepository(AccountModel).findOne({ where: { id: accountId } });
      expect(deletedAccount).toBeNull();
    });
  });

  describe('toEntity', () => {
    it('AccountModel을 Account 엔티티로 변환한다', () => {
      const model = new AccountModel();
      model.id = 1;
      model.name = 'test';
      model.type = AccountType.CARD;
      model.isActive = true;
      model.createdAt = new Date();
      model.updatedAt = new Date();

      const entity = repository.toEntity(model);

      expect(entity).toBeDefined();
      expect(entity.id).toBe(1);
      expect(entity.name).toBe('test');
      expect(entity.type).toBe(AccountType.CARD);
      expect(entity.isActive).toBe(true);
      expect(entity.createdAt).toEqual(model.createdAt);
      expect(entity.updatedAt).toEqual(model.updatedAt);
    });
  });
});
