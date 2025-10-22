import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { UserRepository } from 'src/modules/user/application/user.repository';
import { LoginUsecase } from 'src/modules/user/domain/usecases/login.usecase';
import { TypeormUserRepository } from 'src/infrastructure/typeorm/repository/typeorm-user.repository';
import * as bcrypt from 'bcrypt';
jest.mock('src/infrastructure/typeorm/repository/typeorm-user.repository');
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginUsecase', () => {
  let usecase: LoginUsecase;
  let userRepository: Record<keyof UserRepository, jest.Mock>;
  let errorService: ErrorService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUsecase,
        {
          provide: 'UserRepository',
          useClass: TypeormUserRepository,
        },
        ErrorService,
        JwtService,
      ],
    }).compile();

    usecase = moduleRef.get(LoginUsecase);
    userRepository = moduleRef.get('UserRepository');
    errorService = moduleRef.get(ErrorService);
    jwtService = moduleRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(errorService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('이메일이 존재하지 않으면, 오류 발생', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(usecase.findUserByEmail('test@test.com')).rejects.toThrow(
        errorService.get(ErrorCode.USER_NOT_FOUND).code,
      );
    });
  });

  describe('validatePasswordIsCorrect', () => {
    it('비밀번호가 일치하지 않으면, 오류 발생', async () => {
      bcrypt.compare.mockResolvedValue(false);

      await expect(usecase.validatePasswordIsCorrect('wrongpassword', 'password')).rejects.toThrow(
        errorService.get(ErrorCode.PASSWORD_WRONG).code,
      );
    });
  });
});
