import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import {
  IFindMonthlyExpenseTotalInput,
  IFindMonthlyExpenseTotalOutput,
} from '../../application/dtos/find-monthly-expense-total.dto';

@Injectable()
export class FindMonthlyExpenseTotalUsecase {
  constructor(@Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository) {}

  async execute(input: IFindMonthlyExpenseTotalInput, user: User): Promise<IFindMonthlyExpenseTotalOutput> {
    const { months } = await this.expenseRepository.findMonthlyExpenseTotal(input, user);
    const result: any = [];
    for (const month of input.months.sort((a, b) => a - b)) {
      const monthExpense = months.find((m) => m.month === month);
      result.push({ month, totalExpense: monthExpense?.totalExpense ?? 0, totalCount: monthExpense?.totalCount ?? 0 });
    }
    return { months: result };
  }
}
