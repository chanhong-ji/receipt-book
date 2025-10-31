import { Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from '../../application/budget.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { IFindBudgetInput } from '../../application/dtos/find-budget.dto';
import { IFindBudgetOutput } from '../../application/dtos/find-budget.dto';

@Injectable()
export class FindBudgetUsecase {
  constructor(@Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository) {}

  async execute(input: IFindBudgetInput, user: User): Promise<IFindBudgetOutput> {
    const yearMonths = input.months.map((month) => `${input.year}-${String(month).padStart(2, '0')}-01`);
    const budgets = await this.budgetRepository.findMany(yearMonths, user);
    return { budgets };
  }
}
