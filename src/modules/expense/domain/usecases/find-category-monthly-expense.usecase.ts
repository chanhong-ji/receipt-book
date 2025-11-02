import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import {
  IFindCategoryMonthlyExpenseInput,
  IFindCategoryMonthlyExpenseOutput,
} from '../../application/dtos/find-category-monthly-expense.dto';

/**
 * AI 데이터 분석용
 */
@Injectable()
export class FindCategoryMonthlyExpenseUsecase {
  constructor(@Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository) {}

  async execute(input: IFindCategoryMonthlyExpenseInput, user: User): Promise<IFindCategoryMonthlyExpenseOutput> {
    const monthlyExpenses = await this.expenseRepository.findCategoryMonthly(input, user);

    return { result: monthlyExpenses };
  }
}
