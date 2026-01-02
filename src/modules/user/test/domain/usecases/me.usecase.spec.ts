import { Test } from '@nestjs/testing';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { UserRepository } from 'src/modules/user/application/user.repository';
import { MeUsecase } from 'src/modules/user/domain/usecases/me.usecase';
import { TypeormUserRepository } from 'src/infrastructure/typeorm/repository/typeorm-user.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';

jest.mock('src/infrastructure/typeorm/repository/typeorm-user.repository');

describe('MeUsecase', () => {
  let usecase: MeUsecase;
  let userRepository: Record<keyof UserRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MeUsecase,
        {
          provide: 'UserRepository',
          useClass: TypeormUserRepository,
        },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(MeUsecase);
    userRepository = moduleRef.get('UserRepository');
    errorService = moduleRef.get(ErrorService);
  });

  describe('execute', () => {
    it('사용자가 존재하지 않으면 -> USER_NOT_FOUND 오류 발생해야 한다.', async () => {
      userRepository.findById.mockResolvedValue(null);

      const user = new User();
      user.id = 1;

      await expect(usecase.execute(user)).rejects.toThrow(errorService.get(ErrorCode.USER_NOT_FOUND).code);
    });

    it('사용자가 존재하면 -> user 정보를 반환해야 한다.', async () => {
      const foundUser = new User();
      foundUser.id = 1;
      foundUser.email = 'test@test.com';
      foundUser.name = 'test';

      userRepository.findById.mockResolvedValue(foundUser);

      const user = new User();
      user.id = 1;

      await expect(usecase.execute(user)).resolves.toEqual({
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        },
      });

      expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
