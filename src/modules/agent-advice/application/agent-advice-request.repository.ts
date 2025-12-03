import { RequestStatus } from 'src/infrastructure/typeorm/models/agent-advice-request.model';
import { AgentAdviceRequest } from '../domain/entity/agent-advice-request.entity';

export interface AgentAdviceRequestRepository {
  create(userId: number, status: RequestStatus): Promise<AgentAdviceRequest>;
  findOne(userId: number, status: RequestStatus[]): Promise<AgentAdviceRequest | null>;
  updateStatus(
    requestId: number,
    status: RequestStatus,
    options?: {
      errorMessage?: string;
      startedAt?: Date;
      completedAt?: Date;
    },
  ): Promise<AgentAdviceRequest>;
  findById(requestId: number): Promise<AgentAdviceRequest | null>;
}
