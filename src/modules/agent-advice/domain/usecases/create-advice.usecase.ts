import { Inject, Injectable } from '@nestjs/common';
import { AgentAdviceRepository } from '../../application/agent-advice.repository';
import { AgentAdvice } from '../entity/agent-advice.entity';
import { ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode } from 'src/common/error/error.service';
import axios from 'axios';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { ICreateAgentAdviceInput, ICreateAgentAdviceOutput } from '../../application/dtos/create-agent-advice.dto';

@Injectable()
export class CreateAgentAdviceUsecase {
  protected readonly adviceAgentUrl: string;

  constructor(
    @Inject('AgentAdviceRepository') private readonly repository: AgentAdviceRepository,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
  ) {
    this.adviceAgentUrl = this.configService.getOrThrow('adviceAgent.url');
  }

  async execute(input: ICreateAgentAdviceInput): Promise<ICreateAgentAdviceOutput> {
    const recentAdvice = await this.repository.findOneRecentAdvice(input.userId);
    if (recentAdvice && !this.isAdvicePeriodValid(recentAdvice.periodEnd)) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_PERIOD_INVALID));
    }

    const inputData = await this.createAdviceInputData(input.userId);
    const response = await axios.post(this.adviceAgentUrl + '/generate-advice', inputData);
    const advices = response.data?.advices;

    const today = DateTime.now().toFormat('yyyy-MM-dd');
    const after7Days = DateTime.now().plus({ days: 7 }).toFormat('yyyy-MM-dd');
    const adviceEntities = advices.map((advice) =>
      AgentAdvice.create({ ...advice, periodStart: today, periodEnd: after7Days }),
    );
    const savedAdvices = await this.repository.create(adviceEntities, input.userId);
    return { advices: savedAdvices };
  }

  async createAdviceInputData(userId: number) {
    return this.repository.createInputData(userId);
  }

  isAdvicePeriodValid(periodEnd: string): boolean {
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    return periodEnd <= today;
  }
}
