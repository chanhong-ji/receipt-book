import { Inject, Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../../application/expense.repository';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { ICreateExpenseInput } from '../../application/dtos/create-expense.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { CategoryRepository } from 'src/modules/category/application/category.repository';
import { MerchantRepository } from 'src/modules/merchant/application/merchant.repository';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { Expense } from '../entity/expense.entity';

@Injectable()
export class CreateExpenseUsecase {
  constructor(
    @Inject('ExpenseRepository') private readonly expenseRepository: ExpenseRepository,
    @Inject('CategoryRepository') private readonly categoryRepository: CategoryRepository,
    @Inject('MerchantRepository') private readonly merchantRepository: MerchantRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: ICreateExpenseInput, user: User): Promise<Expense> {
    await this.validate(input, user);

    const expense = Expense.create({
      userId: user.id,
      accountId: input.accountId,
      name: input.name,
      amount: input.amount,
      postedAt: input.postedAt,
      merchantText: input.merchantText,
      memo: input.memo,
      categoryId: input.categoryId,
      merchantId: input.merchantId,
    });

    return this.expenseRepository.save(expense);
  }

  async validate(input: ICreateExpenseInput, user: User): Promise<void> {
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
  }
}
