import { Injectable } from '@nestjs/common';
import { ICreateExpenseInput } from '../application/dtos/create-expense.dto';
import { Expense } from './entity/expense.entity';
import { CreateExpenseUsecase } from './usecases/create-expense.usecase';
import { User } from 'src/modules/user/domain/entity/user.entity';

@Injectable()
export class ExpenseFactory {
  constructor(private readonly createExpenseUsecase: CreateExpenseUsecase) {}

  createExpense(input: ICreateExpenseInput, user: User): Promise<Expense> {
    return this.createExpenseUsecase.execute(input, user);
  }
}
