import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { BudgetRepository } from '../../application/budget.repository';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../../application/dtos/upsert-budget.dto';
import { Budget } from '../entity/budget.entity';

@Injectable()
export class UpsertBudgetUsecase {
  constructor(@Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository) {}

  async execute(input: IUpsertBudgetInput, user: User): Promise<IUpsertBudgetOutput> {
    const yearMonth = this.formatYearMonth(input.year, input.month);

    const existing = await this.budgetRepository.findByYearMonth(yearMonth, user);
    const budget = existing
      ? await this.updateBudget(existing, input.totalAmount)
      : await this.createBudget(yearMonth, input.totalAmount, user);

    return { budget };
  }

  formatYearMonth(year: number, month: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-01`;
  }

  async createBudget(yearMonth: string, totalAmount: number, user: User): Promise<Budget> {
    return this.budgetRepository.create(yearMonth, totalAmount, user);
  }

  async updateBudget(budget: Budget, totalAmount: number): Promise<Budget> {
    await this.budgetRepository.update(budget.id, totalAmount);
    return { ...budget, totalAmount };
  }
}
