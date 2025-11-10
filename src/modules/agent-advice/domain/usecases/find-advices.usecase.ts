import { Inject, Injectable } from '@nestjs/common';
import { AgentAdviceRepository } from '../../application/agent-advice.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindAdvicesOutput } from '../../application/dtos/find-advices.dto';

@Injectable()
export class FindAdvicesUsecase {
  constructor(@Inject('AgentAdviceRepository') private readonly repository: AgentAdviceRepository) {}

  async execute(user: User): Promise<IFindAdvicesOutput> {
    const advices = await this.repository.findAllAdvices(user.id);
    return { advices };
  }
}
