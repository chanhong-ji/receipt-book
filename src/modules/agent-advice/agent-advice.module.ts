import { Module } from '@nestjs/common';
import { AgentAdviceResolver } from './presentation/agent-advice.resolver';
import { AgentAdviceService } from './application/agent-advice.service';

@Module({
  imports: [],
  providers: [AgentAdviceResolver, AgentAdviceService],
})
export class AgentAdviceModule {}


