import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { CategoryModel } from '../models/category.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/modules/category/domain/entity/category.entity';

@Injectable()
export class TypeormCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryModel)
    private readonly repository: Repository<CategoryModel>,
  ) {}
}
