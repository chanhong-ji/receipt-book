import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { AgentAdviceFactory } from '../domain/agent-advice.factory';
import { FindAdvicesOutput } from './dtos/find-advices.dto';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CreateAgentAdviceOutput } from './dtos/create-agent-advice.dto';

@Resolver()
export class AgentAdviceResolver {
  constructor(private readonly factory: AgentAdviceFactory) {}

  @Query(() => FindAdvicesOutput)
  async findAdvices(@AuthUser() user: User): Promise<FindAdvicesOutput> {
    const { advices } = await this.factory.findAdvices(user);
    return {
      ok: true,
      advices,
    };
  }

  @Mutation(() => CreateAgentAdviceOutput)
  async createAgentAdvice(@AuthUser() user: User): Promise<CreateAgentAdviceOutput> {
    await this.factory.createAgentAdvice(user);
    return { ok: true };
  }
}
