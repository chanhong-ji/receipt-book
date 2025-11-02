import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindSummaryInput, IFindSummaryOutput } from 'src/modules/expense/application/dtos/find-summary.dto';
import { CategoryRepository } from 'src/modules/category/application/category.repository';

@Injectable()
export class FindSummaryUsecase {
  constructor(
    @Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: IFindSummaryInput, user: User): Promise<IFindSummaryOutput> {
    const isJanuary = input.thisMonth === 1;
    const lastMonth = isJanuary ? 12 : input.thisMonth - 1;
    const { months } = await this.expenseRepository.findMonthlyExpenseTotal(
      { year: input.thisYear, months: isJanuary ? [1] : [lastMonth, input.thisMonth] },
      user,
    );
    const categories = await this.categoryRepository.findAllWithTotalExpense(user.id, input.thisYear, input.thisMonth);
    const lastMonthExpense = months.find((month) => month.month === lastMonth)?.totalExpense ?? 0;
    const thisMonthExpense = months.find((month) => month.month === input.thisMonth)?.totalExpense ?? 0;
    const topCategory = categories.sort((a, b) => (b.totalExpense ?? 0) - (a.totalExpense ?? 0)).slice(0, 5);

    return {
      summary: {
        lastMonthExpense,
        thisMonthExpense,
        topCategory,
      },
    };
  }
}
