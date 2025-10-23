import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { CategoryResolver } from './presentation/category.resolver';
import { CategoryFactory } from './domain/category.factory';
import { FindCategoriesUsecase } from './domain/usecases/find-categories.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    CategoryResolver,
    CategoryFactory,
    // Usecases
    FindCategoriesUsecase,
  ],
})
export class CategoryModule {}
