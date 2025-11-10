import { Injectable } from '@nestjs/common';
import { CreateAgentAdviceUsecase } from './usecases/create-advice.usecase';
import { ICreateAgentAdviceInput, ICreateAgentAdviceOutput } from '../application/dtos/create-agent-advice.dto';
import { IFindAdvicesOutput } from '../application/dtos/find-advices.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { FindAdvicesUsecase } from './usecases/find-advices.usecase';

@Injectable()
export class AgentAdviceFactory {
  constructor(
    private readonly createAgentAdviceUsecase: CreateAgentAdviceUsecase,
    private readonly findAdvicesUsecase: FindAdvicesUsecase,
  ) {}

  createAgentAdvice(input: ICreateAgentAdviceInput): Promise<ICreateAgentAdviceOutput> {
    return this.createAgentAdviceUsecase.execute(input);
  }

  findAdvices(user: User): Promise<IFindAdvicesOutput> {
    return this.findAdvicesUsecase.execute(user);
  }
}
