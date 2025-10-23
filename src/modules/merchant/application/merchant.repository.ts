import { Merchant } from '../domain/entity/merchant.entity';

export interface MerchantRepository {
  findById(id: number): Promise<Merchant | null>;
}
