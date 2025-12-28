import { Test } from '@nestjs/testing';
import { FindAdvicesUsecase } from '../../../domain/usecases/find-advices.usecase';
import { AgentAdviceRepository } from '../../../application/agent-advice.repository';
import { TypeormAgentAdviceRepository } from 'src/infrastructure/typeorm/repository/typeorm-agent-advice.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';

jest.mock('src/infrastructure/typeorm/repository/typeorm-agent-advice.repository');

describe('FindAdvicesUsecase', () => {
  let usecase: FindAdvicesUsecase;
  let agentAdviceRepository: Record<keyof AgentAdviceRepository, jest.Mock>;

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
        FindAdvicesUsecase,
        {
          provide: 'AgentAdviceRepository',
          useClass: TypeormAgentAdviceRepository,
        },
      ],
    }).compile();

    usecase = moduleRef.get(FindAdvicesUsecase);
    agentAdviceRepository = moduleRef.get('AgentAdviceRepository');
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(agentAdviceRepository).toBeDefined();
  });

  describe('execute', () => {
    it('repository.findAllAdvices 를 호출하고, advices 를 래핑해서 반환한다', async () => {
      const advices = [{ id: 1, title: 'test' }] as any[];
      agentAdviceRepository.findAllAdvices.mockResolvedValue(advices);

      const result = await usecase.execute(mockUser);

      expect(agentAdviceRepository.findAllAdvices).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ advices });
    });
  });
});
