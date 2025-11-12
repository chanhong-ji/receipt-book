import { Injectable } from '@nestjs/common';
import { CreateAgentAdviceUsecase } from './usecases/create-advice.usecase';
import { IFindAdvicesOutput } from '../application/dtos/find-advices.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { FindAdvicesUsecase } from './usecases/find-advices.usecase';

@Injectable()
export class AgentAdviceFactory {
  constructor(
    private readonly createAgentAdviceUsecase: CreateAgentAdviceUsecase,
    private readonly findAdvicesUsecase: FindAdvicesUsecase,
  ) {}

  async createAgentAdvice(user: User): Promise<void> {
    await this.createAgentAdviceUsecase.execute(user);
  }

  findAdvices(user: User): Promise<IFindAdvicesOutput> {
    return this.findAdvicesUsecase.execute(user);
  }
}
