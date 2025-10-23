import { Test } from '@nestjs/testing';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { Category } from 'src/modules/category/domain/entity/category.entity';
import { CreateCategoryUsecase } from 'src/modules/category/domain/usecases/create-category.usecase';
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('CreateCategoryUsecase', () => {
  let usecase: CreateCategoryUsecase;
  let repository: Record<keyof CategoryRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCategoryUsecase,
        { provide: 'CategoryRepository', useClass: TypeormCategoryRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(CreateCategoryUsecase);
    repository = moduleRef.get('CategoryRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('validate', () => {
    it('기존의 카테고리 개수가 10개 초과하면, 오류 발생', () => {
      const existingCategories = Array.from({ length: 10 }, (_, index) => ({ name: `test${index}` }) as Category);
      repository.findAll.mockResolvedValue(existingCategories);

      expect(() => usecase.validate(existingCategories, 'test')).toThrow(
        errorService.get(ErrorCode.CATEGORY_LIMIT_EXCEEDED).code,
      );
    });

    it('기존의 카테고리 중 동일한 이름의 카테고리가 이미 존재하면, 오류 발생', () => {
      const existingCategories = [{ name: 'test' } as Category];
      repository.findAll.mockResolvedValue(existingCategories);

      expect(() => usecase.validate(existingCategories, 'test')).toThrow(
        errorService.get(ErrorCode.CATEGORY_ALREADY_EXISTS).code,
      );
    });
  });

  describe('calculateOrder', () => {
    it('기존의 카테고리 중 가장 큰 정렬 순서를 찾아, 그 값에 1을 더한 값을 리턴', () => {
      const existingCategories = [{ sortOrder: 1 }, { sortOrder: 2 }, { sortOrder: 3 }] as Category[];

      const order = usecase.calculateOrder(existingCategories);

      expect(order).toBe(4);
    });

    it('기존의 카테고리 중 가장 큰 정렬 순서를 찾아, 그 값에 1을 더한 값을 리턴', () => {
      const existingCategories = [{ sortOrder: 4 }] as Category[];

      const order = usecase.calculateOrder(existingCategories);

      expect(order).toBe(5);
    });
  });
});
