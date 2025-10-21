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
}
