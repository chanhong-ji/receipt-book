import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from 'src/modules/expense/application/expense.repository';
import { ExpenseModel } from '../models/expense.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from 'src/modules/expense/domain/entity/expense.entity';

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
        year: expense.year,
        month: expense.month,
        date: expense.date,
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
        year: expense.year,
        month: expense.month,
        date: expense.date,
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

  toEntity(model: ExpenseModel): Expense {
    const expense = new Expense();
    expense.id = model.id;
    expense.name = model.name;
    expense.amount = model.amount;
    expense.postedAt = new Date(model.postedAt);
    expense.year = model.year;
    expense.month = model.month;
    expense.date = model.date;
    expense.userId = model.userId;
    expense.accountId = model.accountId;
    expense.categoryId = model.categoryId;
    expense.merchantId = model.merchantId;
    expense.merchantText = model.merchantText;
    expense.memo = model.memo;
    return expense;
  }
}
