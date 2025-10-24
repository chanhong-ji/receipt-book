import { Injectable } from '@nestjs/common';
import { Expense } from './entity/expense.entity';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ICreateExpenseInput } from '../application/dtos/create-expense.dto';
import { IUpdateExpenseInput } from '../application/dtos/update-expense.dto';
import { IDeleteExpenseInput } from '../application/dtos/delete-expense.dto';
import { CreateExpenseUsecase } from './usecases/create-expense.usecase';
import { UpdateExpenseUsecase } from './usecases/update-expense.usecase';
import { DeleteExpenseUsecase } from './usecases/delete-expense.usecase';

@Injectable()
export class ExpenseFactory {
  constructor(
    private readonly createExpenseUsecase: CreateExpenseUsecase,
    private readonly updateExpenseUsecase: UpdateExpenseUsecase,
    private readonly deleteExpenseUsecase: DeleteExpenseUsecase,
  ) {}

  createExpense(input: ICreateExpenseInput, user: User): Promise<Expense> {
    return this.createExpenseUsecase.execute(input, user);
  }

  updateExpense(input: IUpdateExpenseInput, user: User): Promise<Expense> {
    return this.updateExpenseUsecase.execute(input, user);
  }

  deleteExpense(input: IDeleteExpenseInput, user: User): Promise<void> {
    return this.deleteExpenseUsecase.execute(input, user);
  }
}
