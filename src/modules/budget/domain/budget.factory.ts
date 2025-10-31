import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { DeleteBudgetUsecase } from './usecases/delete-budget.usecase';
import { UpsertBudgetUsecase } from './usecases/upsert-budget.usecase';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../application/dtos/upsert-budget.dto';
import { IDeleteBudgetInput } from '../application/dtos/delete-budget.dto';
import { FindBudgetUsecase } from './usecases/find-budget.usecase';
import { IFindBudgetInput } from '../application/dtos/find-budget.dto';
import { IFindBudgetOutput } from '../application/dtos/find-budget.dto';

@Injectable()
export class BudgetFactory {
  constructor(
    private readonly upsertBudgetUsecase: UpsertBudgetUsecase,
    private readonly deleteBudgetUsecase: DeleteBudgetUsecase,
    private readonly findBudgetUsecase: FindBudgetUsecase,
  ) {}

  upsertBudget(input: IUpsertBudgetInput, user: User): Promise<IUpsertBudgetOutput> {
    return this.upsertBudgetUsecase.execute(input, user);
  }

  async deleteBudget(input: IDeleteBudgetInput, user: User): Promise<void> {
    await this.deleteBudgetUsecase.execute(input, user);
  }

  async findBudgets(input: IFindBudgetInput, user: User): Promise<IFindBudgetOutput> {
    return this.findBudgetUsecase.execute(input, user);
  }
}
