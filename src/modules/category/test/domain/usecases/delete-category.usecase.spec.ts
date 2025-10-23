import { Test } from '@nestjs/testing';
import { DeleteCategoryUsecase } from 'src/modules/category/domain/usecases/delete-category.usecase';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { ErrorService } from 'src/common/error/error.service';
import { Category } from 'src/modules/category/domain/entity/category.entity';
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('DeleteCategoryUsecase', () => {
  let usecase: DeleteCategoryUsecase;
  let repository: Record<keyof CategoryRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteCategoryUsecase,
        { provide: 'CategoryRepository', useClass: TypeormCategoryRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(DeleteCategoryUsecase);
    repository = moduleRef.get('CategoryRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('reindexSortOrders: 카테고리 정렬 순서 재정렬', () => {
    it('카테고리 정렬 순서를 재정렬하고, 카테고리 정렬 순서를 반환', () => {
      const categories = [
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 4 },
      ] as Category[];

      const reindexed = usecase.reindexSortOrders(categories);

      expect(reindexed).toEqual([
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 3 },
      ]);
    });

    it('카테고리 정렬 순서를 재정렬하고, 카테고리 정렬 순서를 반환', () => {
      const categories = [
        { id: 1, sortOrder: 2 },
        { id: 2, sortOrder: 3 },
        { id: 3, sortOrder: 4 },
      ] as Category[];

      const reindexed = usecase.reindexSortOrders(categories);

      expect(reindexed).toEqual([
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 3 },
      ]);
    });

    it('카테고리 정렬 순서를 재정렬하고, 카테고리 정렬 순서를 반환', () => {
      const categories = [
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 5 },
        { id: 1, sortOrder: 1 },
      ] as Category[];

      const reindexed = usecase.reindexSortOrders(categories);

      expect(reindexed).toEqual([
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 3 },
      ]);
    });
  });
});
