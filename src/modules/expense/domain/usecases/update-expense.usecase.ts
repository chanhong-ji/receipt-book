import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { IUpdateExpenseInput } from '../../application/dtos/update-expense.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { MerchantRepository } from 'src/modules/merchant/application/merchant.repository';
import { AccountRepository } from 'src/modules/account/application/account.repository';
import { Expense } from '../entity/expense.entity';

@Injectable()
export class UpdateExpenseUsecase {
  constructor(
    @Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
    @Inject('MerchantRepository') private readonly merchantRepository: MerchantRepository,
    @Inject('AccountRepository') private readonly accountRepository: AccountRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IUpdateExpenseInput, user: User): Promise<Expense> {
    await this.validate(input, user);
    const expense = await this.expenseRepository.findById(input.id, user.id);
    if (!expense) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.EXPENSE_NOT_FOUND));
    }
    expense.update(input);
    return this.expenseRepository.update(expense);
  }

  async validate(input: IUpdateExpenseInput, user: User): Promise<void> {
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId, user.id);
      if (!category) {
        throw new CustomGraphQLError(this.errorService.get(ErrorCode.CATEGORY_NOT_FOUND));
      }
    }

    if (input.merchantId) {
      const merchant = await this.merchantRepository.findById(input.merchantId);
      if (!merchant) {
        throw new CustomGraphQLError(this.errorService.get(ErrorCode.MERCHANT_NOT_FOUND));
      }
    }

    if (input.accountId) {
      const account = await this.accountRepository.findById(input.accountId, user.id);
      if (!account) {
        throw new CustomGraphQLError(this.errorService.get(ErrorCode.ACCOUNT_NOT_FOUND));
      }
    }
  }
}
