import { Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from '../../application/budget.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindBudgetInput } from '../../application/dtos/find-budget.dto';
import { IFindBudgetOutput } from '../../application/dtos/find-budget.dto';
import { CategoryRepository } from 'src/modules/category/application/category.repository';

@Injectable()
export class FindBudgetUsecase {
  constructor(
    @Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: IFindBudgetInput, user: User): Promise<IFindBudgetOutput> {
    const yearMonth = `${input.year}-${String(input.month).padStart(2, '0')}-01`;
    const budgets = await this.budgetRepository.findManyByYearMonth(yearMonth, user);
    const categories = await this.categoryRepository.findAllWithTotalExpense(user.id, input.year, input.month);
    for (const budget of budgets) {
      const category = categories.find((category) => category.id === budget.category?.id);
      budget.category = category;
      budget.totalExpense = category?.totalExpense;
    }
    return { budgets };
  }
}
