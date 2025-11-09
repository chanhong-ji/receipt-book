import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DateTime } from 'luxon';
import { AgentAdviceRepository } from './agent-advice.repository';
import { AgentAdvice } from '../domain/entity/agent-advice.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';

@Injectable()
export class AgentAdviceService {
  protected readonly adviceAgentUrl: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject('AgentAdviceRepository') private readonly repository: AgentAdviceRepository,
    private readonly errorService: ErrorService,
  ) {
    this.adviceAgentUrl = this.configService.getOrThrow('adviceAgent.url');
  }

  async createAgentAdvice(input: { userId: number }) {
    const recentAdvice = await this.repository.findRecentAdvice(input.userId);
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
    return this.repository.create(adviceEntities, input.userId);
  }

  async createAdviceInputData(userId: number) {
    return this.repository.createInputData(userId);
  }

  isAdvicePeriodValid(periodEnd: string): boolean {
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    return periodEnd <= today;
  }
}
