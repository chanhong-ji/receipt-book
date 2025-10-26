import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindExpenseMonthlyInput } from '../../application/dtos/find-expense-monthly.dto';

@Injectable()
export class FindExpenseMonthlyUsecase {
  constructor(@Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository) {}

  async execute(input: IFindExpenseMonthlyInput, user: User) {
    const { expenses, totalCount } = await this.expenseRepository.findMonthly(input, user);
    return { expenses, totalCount };
  }
}
