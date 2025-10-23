import { Test } from '@nestjs/testing';
import { UpdateCategoryUsecase } from 'src/modules/category/domain/usecases/update-category.usecase';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { TypeormCategoryRepository } from 'src/infrastructure/typeorm/repository/typeorm-category.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Category } from 'src/modules/category/domain/entity/category.entity';
jest.mock('src/infrastructure/typeorm/repository/typeorm-category.repository');

describe('UpdateCategoryUsecase', () => {
  let usecase: UpdateCategoryUsecase;
  let repository: Record<keyof CategoryRepository, jest.Mock>;
  let errorService: ErrorService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateCategoryUsecase,
        { provide: 'CategoryRepository', useClass: TypeormCategoryRepository },
        ErrorService,
      ],
    }).compile();

    usecase = moduleRef.get(UpdateCategoryUsecase);
    repository = moduleRef.get('CategoryRepository');
    errorService = moduleRef.get(ErrorService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
    expect(repository).toBeDefined();
    expect(errorService).toBeDefined();
  });

  describe('isDuplicatedName: 카테코리의 이름 중복 여부 확인', () => {
    it('동일한 이름의 카테고리가 이미 존재하면, true를 반환', () => {
      const categories = [{ name: 'test', id: 1 } as Category];

      const input = { name: 'test', id: 2 };

      expect(usecase.isDuplicatedName(categories, input)).toBe(true);
    });

    it('동일한 이름의 카테고리가 이미 존재하지 않으면, false를 반환', () => {
      const categories = [{ name: 'test', id: 1 } as Category];

      const input = { name: 'test2', id: 2 };

      expect(usecase.isDuplicatedName(categories, input)).toBe(false);
    });
  });
});
