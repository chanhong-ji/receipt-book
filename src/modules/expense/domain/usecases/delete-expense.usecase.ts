import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { IDeleteExpenseInput } from '../../application/dtos/delete-expense.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';

@Injectable()
export class DeleteExpenseUsecase {
  constructor(
    @Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IDeleteExpenseInput, user: User): Promise<void> {
    const expense = await this.expenseRepository.findById(input.id, user.id);
    if (!expense) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.EXPENSE_NOT_FOUND));
    }
    await this.expenseRepository.delete(input.id);
  }
}
