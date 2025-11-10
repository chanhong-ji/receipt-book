import { Query, Resolver } from '@nestjs/graphql';
import { AgentAdviceFactory } from '../domain/agent-advice.factory';
import { FindAdvicesOutput } from './dtos/find-advices.dto';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from 'src/modules/user/domain/entity/user.entity';

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
}
