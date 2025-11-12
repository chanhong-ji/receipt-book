import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DateTime } from 'luxon';
import { AgentAdviceRepository } from '../../application/agent-advice.repository';
import { AgentAdvice } from '../entity/agent-advice.entity';
import { ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';

@Injectable()
export class CreateAgentAdviceUsecase {
  protected readonly adviceAgentUrl: string;
  protected readonly minimumExpenseCount = 10;
  protected readonly advicePeriodDays = 7;

  constructor(
    @Inject('AgentAdviceRepository') private readonly repository: AgentAdviceRepository,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
    @Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository,
  ) {
    this.adviceAgentUrl = this.configService.getOrThrow('adviceAgent.url');
  }

  async execute(user: User): Promise<void> {
    console.log('CreateAdviceUsecase run with user.id:', user.id);

    const now = DateTime.now();
    await this.validateMinimumExpenseCount(user, now);
    await this.validateAdvicePeriod(user.id, now);
    this.generateAdvice(user.id, now);
  }

  async validateMinimumExpenseCount(user: User, now: any) {
    const { months } = await this.expenseRepository.findMonthlyExpenseTotal(
      { year: now.year, months: [now.month] },
      user,
    );
    const targetMonth = months[0];
    const totalCount = targetMonth.totalCount;
    if (totalCount < this.minimumExpenseCount) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_TOTAL_COUNT_NOT_ENOUGH));
    }
  }

  async validateAdvicePeriod(userId: number, now: any) {
    const recentAdvice: AgentAdvice | null = await this.repository.findOneRecentAdvice(userId);
    const today = now.toFormat('yyyy-MM-dd');
    if (recentAdvice && recentAdvice.periodEnd >= today) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_PERIOD_INVALID));
    }
  }

  /**
   * @description agent 서버에 요청하여 조언 생성 및 저장
   */
  async generateAdvice(userId: number, now: DateTime): Promise<void> {
    try {
      const inputData = await this.repository.createInputData(userId);
      const { data } = await axios.post(this.adviceAgentUrl, inputData);

      const payload = JSON.parse(data);
      const advices = payload.advices;

      if (!Array.isArray(advices) || advices.length === 0) {
        console.error('Empty or invalid advices from agent');
        throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_GENERATION_FAILED));
      }

      const periodStart = now.toFormat('yyyy-MM-dd');
      const periodEnd = now.plus({ days: this.advicePeriodDays }).toFormat('yyyy-MM-dd');

      const adviceEntities = advices.map((advice: any) =>
        AgentAdvice.create({
          ...advice,
          periodStart,
          periodEnd,
        }),
      );

      await this.repository.create(adviceEntities, userId);
    } catch (error) {
      const errorDetail = this.errorService.get(ErrorCode.ADVICE_GENERATION_FAILED);
      console.error(errorDetail, error);
    }
  }
}
