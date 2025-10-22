import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { CategoryResolver } from './presentation/category.resolver';

@Module({
  imports: [RepositoryModule],
  providers: [CategoryResolver],
})
export class CategoryModule {}
