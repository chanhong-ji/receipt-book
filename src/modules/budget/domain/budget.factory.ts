import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { DeleteBudgetUsecase } from './usecases/delete-budget.usecase';
import { UpsertBudgetUsecase } from './usecases/upsert-budget.usecase';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../application/dtos/upsert-budget.dto';
import { IDeleteBudgetInput } from '../application/dtos/delete-budget.dto';

@Injectable()
export class BudgetFactory {
  constructor(
    private readonly upsertBudgetUsecase: UpsertBudgetUsecase,
    private readonly deleteBudgetUsecase: DeleteBudgetUsecase,
  ) {}

  upsertBudget(input: IUpsertBudgetInput, user: User): Promise<IUpsertBudgetOutput> {
    return this.upsertBudgetUsecase.execute(input, user);
  }

  async deleteBudget(input: IDeleteBudgetInput, user: User): Promise<void> {
    await this.deleteBudgetUsecase.execute(input, user);
  }
}
