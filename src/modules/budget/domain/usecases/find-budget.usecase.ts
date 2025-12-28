import { Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from '../../application/budget.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindBudgetInput } from '../../application/dtos/find-budget.dto';
import { IFindBudgetOutput } from '../../application/dtos/find-budget.dto';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { Category } from 'src/modules/category/domain/entity/category.entity';
import { Budget } from '../entity/budget.entity';

@Injectable()
export class FindBudgetUsecase {
  constructor(
    @Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: IFindBudgetInput, user: User): Promise<IFindBudgetOutput> {
    const yearMonth = this.formatYearMonth(input.year, input.month);
    const budgets = await this.budgetRepository.findManyByYearMonth(yearMonth, user);
    const categories = await this.categoryRepository.findAllWithTotalExpense(user.id, input.year, input.month);
    this.mapCategoryToBudget(budgets, categories);
    return { budgets };
  }

  formatYearMonth(year: number, month: number) {
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }

  mapCategoryToBudget(budgets: Budget[], categories: Category[]) {
    for (const budget of budgets) {
      const category = categories.find((category) => category.id === budget.category?.id);
      budget.category = category;
      budget.totalExpense = category?.totalExpense ?? 0;
    }
  }
}
