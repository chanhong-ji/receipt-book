import { AdviceTag, AdviceType } from 'src/infrastructure/typeorm/models/agent-advice.model';
import { AgentAdvice } from '../domain/entity/agent-advice.entity';

export interface AgentAdviceRepository {
  createInputData(userId: number): Promise<{
    thisMonthTotalExpense: number;
    thisMonthBudgets: {
      categoryName: string;
      totalExpense: number;
      budget: number;
    }[];
    monthlyExpenseTotals: {
      month: number;
      totalExpense: number;
    }[];
    thisMonthExpenses: {
      name: string;
      amount: number;
      postedAt: Date;
      accountName: string;
      categoryName: string;
    }[];
  }>;

  create(
    advices: {
      type: AdviceType;
      adviceText: string;
      tag?: AdviceTag;
      categoryName?: string;
      periodStart: string;
      periodEnd: string;
    }[],
    userId: number,
  ): Promise<AgentAdvice[]>;

  findRecentAdvice(userId: number): Promise<AgentAdvice | null>;
}
