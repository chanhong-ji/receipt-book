import { User } from 'src/modules/user/domain/entity/user.entity';
import { RequestStatus } from 'src/infrastructure/typeorm/models/agent-advice-request.model';

export class AgentAdviceRequest {
  id: number;
  user?: User;
  status: RequestStatus;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  isActive(): boolean {
    return this.status === RequestStatus.PENDING || this.status === RequestStatus.PROCESSING;
  }
}
