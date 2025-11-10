import { AgentAdvice } from '../../domain/entity/agent-advice.entity';

export interface ICreateAgentAdviceInput {
  userId: number;
}

export interface ICreateAgentAdviceOutput {
  advices: AgentAdvice[];
}
