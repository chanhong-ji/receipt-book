import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { CreateAgentAdviceUsecase } from '../../../domain/usecases/create-advice.usecase';
import { AgentAdviceRepository } from '../../../application/agent-advice.repository';
import { AgentAdviceRequestRepository } from '../../../application/agent-advice-request.repository';
import { TypeormAgentAdviceRepository } from 'src/infrastructure/typeorm/repository/typeorm-agent-advice.repository';
import { TypeormAgentAdviceRequestRepository } from 'src/infrastructure/typeorm/repository/typeorm-agent-advice-request.repository';
import { ErrorService } from 'src/common/error/error.service';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { TypeormExpenseRepository } from 'src/infrastructure/typeorm/repository/typeorm-expense.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { RequestStatus } from 'src/infrastructure/typeorm/models/agent-advice-request.model';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';

jest.mock('src/infrastructure/typeorm/repository/typeorm-agent-advice.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-agent-advice-request.repository');
jest.mock('src/infrastructure/typeorm/repository/typeorm-expense.repository');

describe('CreateAgentAdviceUsecase', () => {
  let usecase: CreateAgentAdviceUsecase;
  let agentAdviceRepository: Record<keyof AgentAdviceRepository, jest.Mock>;
  let agentAdviceRequestRepository: Record<keyof AgentAdviceRequestRepository, jest.Mock>;
  let expenseRepository: Record<keyof ExpenseRepository, jest.Mock>;
  let errorService: ErrorService;
  let configService: ConfigService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateAgentAdviceUsecase,
        {
          provide: 'AgentAdviceRepository',
          useClass: TypeormAgentAdviceRepository,
        },
        {
          provide: 'AgentAdviceRequestRepository',
          useClass: TypeormAgentAdviceRequestRepository,
        },
        {
          provide: 'ExpenseRepository',
          useClass: TypeormExpenseRepository,
        },
        ErrorService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'test';
              return null;
            }),
            getOrThrow: jest.fn((key: string) => {
              if (key === 'adviceAgent.url') return 'http://mock-agent-url';
              throw new Error(`Config key ${key} not found`);
            }),
          },
        },
      ],
    }).compile();

    usecase = moduleRef.get(CreateAgentAdviceUsecase);
    agentAdviceRepository = moduleRef.get('AgentAdviceRepository');
    agentAdviceRequestRepository = moduleRef.get('AgentAdviceRequestRepository');
    expenseRepository = moduleRef.get('ExpenseRepository');
    errorService = moduleRef.get(ErrorService);
    configService = moduleRef.get(ConfigService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(agentAdviceRepository).toBeDefined();
    expect(agentAdviceRequestRepository).toBeDefined();
    expect(expenseRepository).toBeDefined();
    expect(errorService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('validateMinimumExpenseCount', () => {
    it('totalCount 가 10 이상이면 성공', async () => {
      const now = DateTime.now();
      expenseRepository.findMonthlyExpenseTotal.mockResolvedValue({
        months: [{ totalCount: 10, totalAmount: 100000 }],
      });

      await expect(usecase.validateMinimumExpenseCount(mockUser, now)).resolves.not.toThrow();
    });

    it('totalCount 가 10 미만이면 오류 발생', async () => {
      const now = DateTime.now();
      expenseRepository.findMonthlyExpenseTotal.mockResolvedValue({
        months: [{ totalCount: 5, totalAmount: 50000 }],
      });

      await expect(usecase.validateMinimumExpenseCount(mockUser, now)).rejects.toThrow(CustomGraphQLError);
    });

    it('expense 데이터가 없으면 오류 발생', async () => {
      const now = DateTime.now();
      expenseRepository.findMonthlyExpenseTotal.mockResolvedValue({
        months: [],
      });

      await expect(usecase.validateMinimumExpenseCount(mockUser, now)).rejects.toThrow(CustomGraphQLError);
    });
  });

  describe('validateAdvicePeriod', () => {
    it('최근 조언이 없으면 성공', async () => {
      const now = DateTime.now();
      agentAdviceRepository.findOneRecentAdvice.mockResolvedValue(null);

      await expect(usecase.validateAdvicePeriod(mockUser.id, now)).resolves.not.toThrow();
    });

    it('최근 조언의 periodEnd 가 오늘 이전이면 성공', async () => {
      const now = DateTime.now();
      const pastDate = now.minus({ days: 8 }).toFormat('yyyy-MM-dd');
      agentAdviceRepository.findOneRecentAdvice.mockResolvedValue({
        id: 1,
        periodEnd: pastDate,
      });

      await expect(usecase.validateAdvicePeriod(mockUser.id, now)).resolves.not.toThrow();
    });

    it('최근 조언의 periodEnd 가 오늘 이후이면 오류 발생', async () => {
      const now = DateTime.now();
      const futureDate = now.plus({ days: 3 }).toFormat('yyyy-MM-dd');
      agentAdviceRepository.findOneRecentAdvice.mockResolvedValue({
        id: 1,
        periodEnd: futureDate,
      });

      await expect(usecase.validateAdvicePeriod(mockUser.id, now)).rejects.toThrow(CustomGraphQLError);
    });
  });

  describe('validateNoActiveRequest', () => {
    it('active request (PENDING, PROCESSING)가 없으면 성공', async () => {
      agentAdviceRequestRepository.findOne.mockResolvedValue(null);

      await expect(usecase.validateNoActiveRequest(mockUser.id)).resolves.not.toThrow();
    });

    it('오늘 생성된 PENDING request가 있으면 오류 발생', async () => {
      agentAdviceRequestRepository.findOne.mockResolvedValue({
        id: 1,
        status: RequestStatus.PENDING,
        createdAt: new Date(), // 오늘
      });

      await expect(usecase.validateNoActiveRequest(mockUser.id)).rejects.toThrow(CustomGraphQLError);
    });

    it('오늘 생성된 PROCESSING request가 있으면 오류 발생', async () => {
      agentAdviceRequestRepository.findOne.mockResolvedValue({
        id: 1,
        status: RequestStatus.PROCESSING,
        startedAt: new Date(),
        createdAt: new Date(), // 오늘
      });

      await expect(usecase.validateNoActiveRequest(mockUser.id)).rejects.toThrow(CustomGraphQLError);
    });

    it('어제 생성된 PENDING request는 오늘 새 요청을 막지 않음', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      agentAdviceRequestRepository.findOne.mockResolvedValue({
        id: 1,
        status: RequestStatus.PENDING,
        createdAt: yesterday,
      });

      await expect(usecase.validateNoActiveRequest(mockUser.id)).resolves.not.toThrow();
    });

    it('어제 생성된 PROCESSING request는 오늘 새 요청을 막지 않음', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      agentAdviceRequestRepository.findOne.mockResolvedValue({
        id: 1,
        status: RequestStatus.PROCESSING,
        startedAt: yesterday,
        createdAt: yesterday,
      });

      await expect(usecase.validateNoActiveRequest(mockUser.id)).resolves.not.toThrow();
    });
  });

  describe('validateAdvices', () => {
    it('array가 비어있으면 오류 발생', () => {
      const advices: any[] = [];

      expect(() => usecase.validateAdvices(advices)).toThrow('Empty or invalid advices received');
    });

    it('input이 array가 아니면 오류 발생', () => {
      const advices = null;

      expect(() => usecase.validateAdvices(advices as any)).toThrow('Empty or invalid advices received');
    });

    it('input이 undefined이면 오류 발생', () => {
      const advices = undefined;

      expect(() => usecase.validateAdvices(advices as any)).toThrow('Empty or invalid advices received');
    });
  });

  describe('createAdviceEntities', () => {
    it('periodStart를 오늘 날짜로 설정하고 periodEnd를 7일 후로 설정', () => {
      const now = DateTime.now();
      const advices = [{ type: 'SUMMARY_REPORT', adviceText: 'test', tag: 'ON_TRACK' }];

      const result = usecase.createAdviceEntities(advices, now);

      expect(result[0].periodStart).toBe(now.toFormat('yyyy-MM-dd'));
      expect(result[0].periodEnd).toBe(now.plus({ days: 7 }).toFormat('yyyy-MM-dd'));
    });
  });
});
