import { AdviceType, AdviceTag } from 'src/infrastructure/typeorm/models/agent-advice.model';
import { User } from 'src/modules/user/domain/entity/user.entity';

export class AgentAdvice {
  id: number;
  user?: User;
  type: AdviceType;
  adviceText: string;
  tag?: AdviceTag;
  categoryName?: string;
  periodStart: string; // YYYY-MM-DD, 기간 시작일
  periodEnd: string; // YYYY-MM-DD, 기간 종료일 (기간 시작일 + 7일)
  createdAt: Date;
  updatedAt: Date;

  static create(advice: {
    type: AdviceType;
    adviceText: string;
    tag?: AdviceTag;
    categoryName?: string;
    periodStart: string;
    periodEnd: string;
  }): AgentAdvice {
    const adviceEntity = new AgentAdvice();
    adviceEntity.type = advice.type;
    adviceEntity.adviceText = advice.adviceText;
    adviceEntity.tag = advice.tag;
    adviceEntity.categoryName = advice.categoryName;
    adviceEntity.periodStart = advice.periodStart;
    adviceEntity.periodEnd = advice.periodEnd;
    return adviceEntity;
  }
}
