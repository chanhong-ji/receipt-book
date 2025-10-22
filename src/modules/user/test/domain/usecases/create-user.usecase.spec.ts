import { Test } from '@nestjs/testing';
import { CreateUserUsecase } from '../../../domain/usecases/create-user.usecase';
import { ErrorCode, ErrorService } from '../../../../../common/error/error.service';
import { UserRepository } from '../../../application/user.repository';
import { TypeormUserRepository } from 'src/infrastructure/typeorm/repository/typeorm-user.repository';
import { ConfigService } from '@nestjs/config';
jest.mock('src/infrastructure/typeorm/repository/typeorm-user.repository');

describe('CreateUserUsecase', () => {
  let usecase: CreateUserUsecase;
  let userRepository: Record<keyof UserRepository, jest.Mock>;
  let errorService: ErrorService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUsecase,
        {
          provide: 'UserRepository',
          useClass: TypeormUserRepository,
        },
        ErrorService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    usecase = moduleRef.get(CreateUserUsecase);
    userRepository = moduleRef.get('UserRepository');
    errorService = moduleRef.get(ErrorService);
    configService = moduleRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(errorService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('validateEmailDuplicate', () => {
    it('기존 이메일이 존재하면, 오류 발생', async () => {
      userRepository.findByEmail.mockResolvedValue('test@test.com');

      await expect(usecase.validateEmailDuplicate('test@test.com')).rejects.toThrow(
        errorService.get(ErrorCode.EMAIL_ALREADY_EXISTS).code,
      );
    });
  });
});
