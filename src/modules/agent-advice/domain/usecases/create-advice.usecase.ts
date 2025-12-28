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
import { AgentAdviceRequestRepository } from '../../application/agent-advice-request.repository';
import { RequestStatus } from 'src/infrastructure/typeorm/models/agent-advice-request.model';

@Injectable()
export class CreateAgentAdviceUsecase {
  protected readonly adviceAgentUrl: string;
  protected readonly minimumExpenseCount = 10;
  protected readonly advicePeriodDays = 7;

  constructor(
    @Inject('AgentAdviceRepository') private readonly repository: AgentAdviceRepository,
    @Inject('AgentAdviceRequestRepository')
    private readonly requestRepository: AgentAdviceRequestRepository,
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
    await this.validateNoActiveRequest(user.id);
    await this.validateAdvicePeriod(user.id, now);
    const request = await this.requestRepository.create(user.id, RequestStatus.PENDING);
    this.generateAdvice(user.id, now, request.id);
  }

  async validateMinimumExpenseCount(user: User, now: any) {
    const { months } = await this.expenseRepository.findMonthlyExpenseTotal(
      { year: now.year, months: [now.month] },
      user,
    );
    const targetMonth = months[0];
    if (!targetMonth || targetMonth.totalCount < this.minimumExpenseCount) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.EXPENSE_TOTAL_COUNT_NOT_ENOUGH));
    }
  }

  async validateAdvicePeriod(userId: number, now: any) {
    const recentAdvice: AgentAdvice | null = await this.repository.findOneRecentAdvice(userId);
    const today = now.toFormat('yyyy-MM-dd');
    if (recentAdvice && recentAdvice.periodEnd >= today) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_PERIOD_INVALID));
    }
  }

  async validateNoActiveRequest(userId: number): Promise<void> {
    const activeRequest = await this.requestRepository.findOne(userId, [
      RequestStatus.PENDING,
      RequestStatus.PROCESSING,
    ]);

    if (activeRequest) {
      const today = DateTime.now().startOf('day');
      const requestDate = DateTime.fromJSDate(activeRequest.createdAt).startOf('day');
      if (requestDate >= today) {
        throw new CustomGraphQLError(this.errorService.get(ErrorCode.ADVICE_REQUEST_IN_PROGRESS));
      }
    }
  }

  /**
   * @description agent 서버에 요청하여 조언 생성 및 저장
   * 로컬 (개발 환경)에서는 mock 데이터로 대체
   */
  async generateAdvice(userId: number, now: DateTime, requestId: number): Promise<void> {
    try {
      await this.requestRepository.updateStatus(requestId, RequestStatus.PROCESSING, {
        startedAt: DateTime.now().toJSDate(),
      });

      const advices = await this.fetchAdvicesFromAgent(userId);
      const adviceEntities = this.createAdviceEntities(advices, now);
      await this.repository.create(adviceEntities, userId);

      await this.handleSuccess(userId, requestId);
    } catch (error) {
      await this.handleFailure(userId, requestId, error);
    }
  }

  /**
   * Agent 서버에서 조언 데이터를 가져옴 (프로덕션) 또는 Mock 데이터 반환 (개발)
   */
  async fetchAdvicesFromAgent(userId: number): Promise<any[]> {
    const isProduction = this.configService.get('env') === 'production';
    const inputData = await this.repository.createInputInformation(userId);

    let advices: any[];
    if (!isProduction) {
      advices = await this.getMockAdvicesAfter10Sec();
    } else {
      const { data } = await axios.post(this.adviceAgentUrl, inputData);
      const payload = JSON.parse(data);
      advices = payload.advices;
    }

    this.validateAdvices(advices);
    return advices;
  }

  validateAdvices(advices: any[]): void {
    if (!Array.isArray(advices) || advices.length === 0) {
      console.error('Empty or invalid advices from agent');
      throw new Error('Empty or invalid advices received');
    }
  }

  createAdviceEntities(advices: any[], now: DateTime): AgentAdvice[] {
    const periodStart = now.toFormat('yyyy-MM-dd');
    const periodEnd = now.plus({ days: this.advicePeriodDays }).toFormat('yyyy-MM-dd');

    return advices.map((advice: any) =>
      AgentAdvice.create({
        ...advice,
        periodStart,
        periodEnd,
      }),
    );
  }

  async handleSuccess(userId: number, requestId: number): Promise<void> {
    await this.requestRepository.updateStatus(requestId, RequestStatus.COMPLETED, {
      completedAt: DateTime.now().toJSDate(),
    });
    console.log(`[SUCCESS] Agent advice generated for user ${userId}, request ${requestId}`);
  }

  async handleFailure(userId: number, requestId: number, error: any): Promise<void> {
    console.error(`[FAILED] Agent advice generation failed for user ${userId}, request ${requestId}:`, error);

    await this.requestRepository.updateStatus(requestId, RequestStatus.FAILED, {
      errorMessage: error.message || 'Unknown error',
      completedAt: DateTime.now().toJSDate(),
    });
  }

  /**
   * @description 10초 후에 mock 데이터 반환
   */
  getMockAdvicesAfter10Sec(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            type: 'SUMMARY_REPORT',
            adviceText: '조언 1',
            tag: 'ON_TRACK',
            categoryName: null,
          },
          {
            type: 'HABIT_INSIGHT',
            adviceText: '조언 2',
            tag: 'WATCH',
            categoryName: null,
          },
          {
            type: 'CATEGORY_TIPS',
            adviceText: '조언 3',
            tag: 'WARNING',
            categoryName: '카테고리 3',
          },
        ]);
      }, 10000);
    });
  }
}
