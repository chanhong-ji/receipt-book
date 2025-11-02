import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { ExpenseModel } from '../models/expense.model';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Expense } from 'src/modules/expense/domain/entity/expense.entity';
import { IFindExpenseMonthlyInput } from 'src/modules/expense/application/dtos/find-expense-monthly.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindMonthlyExpenseTotalInput } from 'src/modules/expense/application/dtos/find-monthly-expense-total.dto';
import {
  IFindCategoryMonthlyExpenseInput,
  IFindCategoryMonthlyExpenseOutput,
} from 'src/modules/expense/application/dtos/find-category-monthly-expense.dto';

@Injectable()
export class TypeormExpenseRepository implements ExpenseRepository {
  constructor(
    @InjectRepository(ExpenseModel)
    private readonly repository: Repository<ExpenseModel>,
  ) {}

  async findById(id: number, userId: number): Promise<Expense | null> {
    const model = await this.repository.findOne({ where: { id, user: { id: userId } } });
    if (!model) return null;
    return this.toEntity(model);
  }

  async update(expense: Expense): Promise<Expense> {
    const model = await this.repository.save({
      id: expense.id,
      ...(expense.name && { name: expense.name }),
      ...(expense.amount && { amount: expense.amount }),
      ...(expense.postedAt && {
        postedAt: expense.postedAt,
        year: expense.postedAt.getFullYear(),
        month: expense.postedAt.getMonth() + 1,
        date: expense.postedAt.getDate(),
      }),
      ...(expense.accountId && { account: { id: expense.accountId } }),
      ...(expense.categoryId && { category: { id: expense.categoryId } }),
      ...(expense.merchantId && { merchant: { id: expense.merchantId } }),
      ...(expense.merchantText && { merchantText: expense.merchantText }),
      ...(expense.memo && { memo: expense.memo }),
    });
    return this.toEntity(model);
  }

  async save(expense: Expense): Promise<Expense> {
    const model = await this.repository.save(
      this.repository.create({
        name: expense.name,
        amount: expense.amount,
        postedAt: expense.postedAt,
        year: expense.postedAt.getFullYear(),
        month: expense.postedAt.getMonth() + 1,
        date: expense.postedAt.getDate(),
        user: { id: expense.userId },
        account: { id: expense.accountId },
        ...(expense.categoryId && { category: { id: expense.categoryId } }),
        ...(expense.merchantId && { merchant: { id: expense.merchantId } }),
        merchantText: expense.merchantText,
        memo: expense.memo,
      }),
    );
    return this.toEntity(model);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findMonthly(input: IFindExpenseMonthlyInput, user: User) {
    const { year, month, categoryIds, accountIds, skip, take } = input;
    const [models, totalCount] = await this.repository.findAndCount({
      where: {
        user: { id: user.id },
        year,
        month,
        ...(categoryIds && { category: { id: In(categoryIds) } }),
        ...(accountIds && { account: { id: In(accountIds) } }),
      },
      skip,
      take,
      order: {
        postedAt: 'DESC',
        name: 'ASC',
      },
    });
    return { expenses: models.map(this.toEntity), totalCount };
  }

  async findMonthlyExpenseTotal(input: IFindMonthlyExpenseTotalInput, user: User) {
    const { year, months } = input;
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('month, SUM(amount) as "totalExpense", COUNT(*) as "totalCount"')
      .where('expense.userId = :userId', { userId: user.id })
      .andWhere('expense.year = :year', { year })
      .andWhere('expense.month IN (:...months)', { months })
      .groupBy('expense.month')
      .getRawMany();

    return {
      months: result.map((model) => ({
        month: model.month,
        totalExpense: Number(model.totalExpense),
        totalCount: Number(model.totalCount),
      })),
    };
  }

  async findCategoryMonthly(
    input: IFindCategoryMonthlyExpenseInput,
    user: User,
  ): Promise<{ categoryId: number; totalExpense: number }[]> {
    const { year, months } = input;
    const raw = await this.repository
      .createQueryBuilder('expense')
      .select('expense.categoryId', 'categoryId')
      .addSelect('SUM(expense.amount)', 'totalExpense')
      .where('expense.userId = :userId', { userId: user.id })
      .andWhere('expense.year = :year', { year })
      .andWhere('expense.month IN (:...months)', { months })
      .groupBy('expense.categoryId')
      .orderBy('"totalExpense"', 'DESC')
      .getRawMany();
    return raw;
  }

  toEntity(model: ExpenseModel): Expense {
    const expense = new Expense();
    expense.id = model.id;
    expense.name = model.name;
    expense.amount = model.amount;
    expense.postedAt = new Date(model.postedAt);
    expense.userId = model.userId;
    expense.accountId = model.accountId;
    expense.categoryId = model.categoryId;
    expense.merchantId = model.merchantId;
    expense.merchantText = model.merchantText;
    expense.memo = model.memo;
    return expense;
  }
}
