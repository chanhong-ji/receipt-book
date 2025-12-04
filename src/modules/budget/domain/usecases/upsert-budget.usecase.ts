import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { BudgetRepository } from '../../application/budget.repository';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../../application/dtos/upsert-budget.dto';
import { Budget } from '../entity/budget.entity';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';

@Injectable()
export class UpsertBudgetUsecase {
  constructor(
    @Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IUpsertBudgetInput, user: User): Promise<IUpsertBudgetOutput> {
    const yearMonth = this.formatYearMonth(input.year, input.month);

    await this.validateCategory(input.categoryId, user);

    const existing = await this.budgetRepository.findByCategory(yearMonth, user, input.categoryId);
    const budget = existing
      ? await this.updateBudget(existing, input.totalAmount)
      : await this.createBudget(yearMonth, input.totalAmount, user, input.categoryId);

    return { budget };
  }

  formatYearMonth(year: number, month: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-01`;
  }

  async createBudget(yearMonth: string, totalAmount: number, user: User, categoryId?: number): Promise<Budget> {
    return this.budgetRepository.create(yearMonth, totalAmount, user, categoryId);
  }

  async updateBudget(budget: Budget, totalAmount: number): Promise<Budget> {
    await this.budgetRepository.update(budget.id, totalAmount);
    return { ...budget, totalAmount };
  }

  async validateCategory(categoryId: number, user: User) {
    const category = await this.categoryRepository.findById(categoryId, user.id);
    if (!category) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_NOT_FOUND));
    }
  }
}
