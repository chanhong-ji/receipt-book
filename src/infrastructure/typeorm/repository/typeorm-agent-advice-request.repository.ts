import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AgentAdviceRequestModel, RequestStatus } from '../models/agent-advice-request.model';
import { AgentAdviceRequestRepository } from 'src/modules/agent-advice/application/agent-advice-request.repository';
import { AgentAdviceRequest } from 'src/modules/agent-advice/domain/entity/agent-advice-request.entity';

@Injectable()
export class TypeormAgentAdviceRequestRepository implements AgentAdviceRequestRepository {
  constructor(
    @InjectRepository(AgentAdviceRequestModel)
    private readonly repository: Repository<AgentAdviceRequestModel>,
  ) {}

  async create(userId: number, status: RequestStatus): Promise<AgentAdviceRequest> {
    const model = this.repository.create({
      user: { id: userId },
      status,
    });
    const savedModel = await this.repository.save(model);
    return this.toEntity(savedModel);
  }

  async findOne(userId: number, status: RequestStatus[]): Promise<AgentAdviceRequest | null> {
    const model = await this.repository.findOne({
      where: { user: { id: userId }, status: In(status) },
      order: { createdAt: 'DESC' },
    });
    return model ? this.toEntity(model) : null;
  }

  async updateStatus(
    requestId: number,
    status: RequestStatus,
    options?: {
      errorMessage?: string;
      startedAt?: Date;
      completedAt?: Date;
    },
  ): Promise<AgentAdviceRequest> {
    const updateData: Partial<AgentAdviceRequestModel> = {
      id: requestId,
      status,
    };

    if (options?.errorMessage !== undefined) {
      updateData.errorMessage = options.errorMessage;
    }
    if (options?.startedAt !== undefined) {
      updateData.startedAt = options.startedAt;
    }
    if (options?.completedAt !== undefined) {
      updateData.completedAt = options.completedAt;
    }

    const model = await this.repository.save(updateData);
    return this.toEntity(model);
  }

  async findById(requestId: number): Promise<AgentAdviceRequest | null> {
    const model = await this.repository.findOne({ where: { id: requestId } });
    return model ? this.toEntity(model) : null;
  }

  private toEntity(model: AgentAdviceRequestModel): AgentAdviceRequest {
    const entity = new AgentAdviceRequest();
    entity.id = model.id;
    entity.status = model.status;
    entity.errorMessage = model.errorMessage;
    entity.startedAt = model.startedAt;
    entity.completedAt = model.completedAt;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}
