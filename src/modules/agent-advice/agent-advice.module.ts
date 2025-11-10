import { Module } from '@nestjs/common';
import { AgentAdviceResolver } from './presentation/agent-advice.resolver';
import { AgentAdviceFactory } from './domain/agent-advice.factory';
import { CreateAgentAdviceUsecase } from './domain/usecases/create-advice.usecase';
import { FindAdvicesUsecase } from './domain/usecases/find-advices.usecase';

@Module({
  imports: [],
  providers: [
    AgentAdviceResolver,
    AgentAdviceFactory,
    // Usecases
    CreateAgentAdviceUsecase,
    FindAdvicesUsecase,
  ],
  exports: [AgentAdviceFactory],
})
export class AgentAdviceModule {}
