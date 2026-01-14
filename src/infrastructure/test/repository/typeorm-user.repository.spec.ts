import { Test, TestingModule } from '@nestjs/testing';
import { TypeormUserRepository } from 'src/infrastructure/typeorm/repository/typeorm-user.repository';
import { createTestTypeormModule } from '../utils/test-typeorm.module';
import { UserModel } from 'src/infrastructure/typeorm/models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { createTestUser } from '../utils/helper/user.helper';

describe('TypeormUserRepository', () => {
  let repository: TypeormUserRepository;
  let database: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [createTestTypeormModule(), TypeOrmModule.forFeature([UserModel])],
      providers: [
        {
          provide: 'UserRepository',
          useClass: TypeormUserRepository,
        },
      ],
    }).compile();

    database = module.get(DataSource);
    repository = module.get<TypeormUserRepository>('UserRepository');
  });

  describe('save', () => {
    it('should save a user', async () => {
      const user = User.create('test@test.com', 'test', 'password');

      const savedUser = await repository.save(user);

      expect(savedUser.id).toBeDefined();
      expect(savedUser.email).toBe(user.email);
      expect(savedUser.name).toBe(user.name);
      expect(savedUser.password).toBe(user.password);
      expect(savedUser.createdAt).toBeInstanceOf(Date);
      expect(savedUser.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('id로 사용자를 조회하면 -> User 엔티티를 반환한다.', async () => {
      const savedUserId = await createTestUser(database, { email: 'a@test.com', name: 'a', password: 'pw' });

      const found = await repository.findById(savedUserId);

      expect(found).not.toBeNull();
      expect(found!.id).toBe(savedUserId);
      expect(found!.email).toBe('a@test.com');
      expect(found!.name).toBe('a');
      expect(found!.password).toBe('pw');
    });

    it('id로 사용자를 조회할 수 없으면 -> null을 반환한다.', async () => {
      const found = await repository.findById(999999);
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('email로 사용자를 조회하면 -> User 엔티티를 반환한다.', async () => {
      await createTestUser(database, { email: 'b@test.com', name: 'b', password: 'pw' });

      const found = await repository.findByEmail('b@test.com');

      expect(found).not.toBeNull();
      expect(found!.email).toBe('b@test.com');
      expect(found!.name).toBe('b');
      expect(found!.password).toBe('pw');
      expect(found!.id).toBeDefined();
    });

    it('email로 사용자를 조회할 수 없으면 -> null을 반환한다.', async () => {
      const found = await repository.findByEmail('missing@test.com');
      expect(found).toBeNull();
    });
  });

  describe('toEntity', () => {
    it('UserModel을 User 엔티티로 변환한다.', () => {
      const model = new UserModel();
      model.id = 1;
      model.email = 'test@test.com';
      model.name = 'test';
      model.password = 'password';

      const entity = repository.toEntity(model);

      expect(entity.id).toBe(1);
      expect(entity.email).toBe('test@test.com');
      expect(entity.name).toBe('test');
      expect(entity.password).toBe('password');
    });
  });
});
