import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { UserModel } from './user.model';

export enum RequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity({ name: 'agent_advice_request' })
export class AgentAdviceRequestModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserModel, { nullable: false, onDelete: 'CASCADE' })
  user: UserModel;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
