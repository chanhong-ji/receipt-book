import { Injectable } from '@nestjs/common';
import { MerchantRepository } from 'src/modules/merchant/application/merchant.repository';
import { MerchantModel } from '../models/merchant.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from 'src/modules/merchant/domain/entity/merchant.entity';

@Injectable()
export class TypeormMerchantRepository implements MerchantRepository {
  constructor(
    @InjectRepository(MerchantModel)
    private readonly repository: Repository<MerchantModel>,
  ) {}

  async findById(id: number): Promise<Merchant | null> {
    const model = await this.repository.findOne({ where: { id } });
    if (!model) return null;
    return this.toEntity(model);
  }

  toEntity(model: MerchantModel): Merchant {
    const merchant = new Merchant();
    merchant.id = model.id;
    merchant.normalizedName = model.normalizedName;
    merchant.createdAt = model.createdAt;
    merchant.updatedAt = model.updatedAt;
    return merchant;
  }
}
