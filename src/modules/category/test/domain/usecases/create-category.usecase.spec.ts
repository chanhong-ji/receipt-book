import { Test } from '@nestjs/testing';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { Category } from 'src/modules/category/domain/entity/category.entity';
import { CreateCategoryUsecase } from 'src/modules/category/domain/usecases/create-category.usecase';
import { User } from 'src/modules/user/domain/entity/user.entity';

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

  describe('execute', () => {
    it('성공', async () => {
      const user = { id: 1 } as User;
      const input = { name: '새 카테고리' };
      const existingCategories: Category[] = [];
      repository.findAll.mockResolvedValue(existingCategories);
      repository.save.mockImplementation((category) => Promise.resolve(category));

      const result = await usecase.execute(input, user);

      expect(result.name).toBe(input.name);
      expect(result.sortOrder).toBe(1);
      expect(repository.save).toHaveBeenCalled();
    });

    it('실패', async () => {
      const user = { id: 1 } as User;
      const input = { name: '새 카테고리' };
      const existingCategories = Array.from({ length: 10 }, (_, i) => ({ name: `cat${i}` }) as Category);

      repository.findAll.mockResolvedValue(existingCategories);

      await expect(usecase.execute(input, user)).rejects.toThrow(
        errorService.get(ErrorCode.CATEGORY_LIMIT_EXCEEDED).code,
      );
    });
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
