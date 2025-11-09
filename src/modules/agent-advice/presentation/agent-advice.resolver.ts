import { Query, Resolver } from '@nestjs/graphql';
import { AgentAdviceService } from '../application/agent-advice.service';

@Resolver()
export class AgentAdviceResolver {
  constructor(private readonly service: AgentAdviceService) {}
}
