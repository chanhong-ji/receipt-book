import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'merchant' })
export class MerchantModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'normalized_name', nullable: false, unique: true })
  normalizedName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
