import { Module } from '@nestjs/common';
import { MerchantResolver } from './presentation/merchant.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [MerchantResolver],
})
export class MerchantModule {}
