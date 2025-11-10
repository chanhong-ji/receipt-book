import { registerEnumType } from '@nestjs/graphql';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Column, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';

export enum AdviceType {
  SUMMARY_REPORT = 'SUMMARY_REPORT', // -- 조언1: 월간 소비 리포트
  HABIT_INSIGHT = 'HABIT_INSIGHT', // -- 조언2: 소비 습관 인사이트
  BUDGET_STATUS = 'BUDGET_STATUS', // -- 조언3: 예산 상태 요약/초과 예측
  CATEGORY_TIPS = 'CATEGORY_TIPS', // -- 조언4: 카테고리별 조언
}

export enum AdviceTag {
  ON_TRACK = 'ON_TRACK', // -- 예산 초과 없음
  WATCH = 'WATCH', // -- 예산 초과 주시
  WARNING = 'WARNING', // -- 예산 초과 경고
  OVERRUN = 'OVERRUN', // -- 예산 초과
}

registerEnumType(AdviceType, {
  name: 'AdviceType',
});

registerEnumType(AdviceTag, {
  name: 'AdviceTag',
});

@Entity({ name: 'agent_advice' })
export class AgentAdviceModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserModel, { nullable: false, cascade: true, onDelete: 'CASCADE' })
  user: UserModel;

  @Column({ type: 'enum', enum: AdviceType, nullable: false })
  type: AdviceType;

  @Column({ name: 'advice_text', nullable: false })
  adviceText: string;

  @Column({ type: 'enum', enum: AdviceTag, nullable: true })
  tag?: AdviceTag;

  @Column({ name: 'category_name', nullable: true })
  categoryName?: string;

  @Column({ name: 'period_start', type: 'date', nullable: true })
  periodStart: string;

  @Column({ name: 'period_end', type: 'date', nullable: true })
  periodEnd: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
