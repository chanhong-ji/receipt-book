import { Test } from '@nestjs/testing';
import { FindCategoriesUsecase } from 'src/modules/category/domain/usecases/find-categories.usecase';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { Category } from 'src/modules/category/domain/entity/category.entity';
import { DateTime } from 'luxon';

jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('FindCategoriesUsecase', () => {
  let usecase: FindCategoriesUsecase;
  let repository: Record<keyof CategoryRepository, jest.Mock>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [FindCategoriesUsecase, { provide: 'CategoryRepository', useClass: TypeormCategoryRepository }],
    }).compile();

    usecase = moduleRef.get(FindCategoriesUsecase);
    repository = moduleRef.get('CategoryRepository');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('이번 달 기준으로 findAllWithTotalExpense 를 호출하고 결과를 반환한다', async () => {
      const userId = 1;
      const thisYear = DateTime.now().year;
      const thisMonth = DateTime.now().month;

      const categories = [{ id: 1, name: 'cat' }] as Category[];
      repository.findAllWithTotalExpense.mockResolvedValue(categories);

      const result = await usecase.execute(userId);

      expect(repository.findAllWithTotalExpense).toHaveBeenCalledWith(userId, thisYear, thisMonth);
    });
  });
});
