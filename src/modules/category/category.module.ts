import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';
import { CategoryResolver } from './presentation/category.resolver';
import { CategoryFactory } from './domain/category.factory';
import { FindCategoriesUsecase } from './domain/usecases/find-categories.usecase';
import { CreateCategoryUsecase } from './domain/usecases/create-category.usecase';
import { UpdateCategoryUsecase } from './domain/usecases/update-category.usecase';
import { DeleteCategoryUsecase } from './domain/usecases/delete-category.usecase';

@Module({
  imports: [RepositoryModule],
  providers: [
    CategoryResolver,
    CategoryFactory,
    // Usecases
    FindCategoriesUsecase,
    CreateCategoryUsecase,
    UpdateCategoryUsecase,
    DeleteCategoryUsecase,
  ],
})
export class CategoryModule {}
