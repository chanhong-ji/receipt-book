import { Injectable } from '@nestjs/common';
import { UpsertBudgetUsecase } from './usecases/upsert-budget.usecase';
import { IUpsertBudgetInput, IUpsertBudgetOutput } from '../application/dtos/upsert-budget.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';

@Injectable()
export class BudgetFactory {
  constructor(private readonly upsertBudgetUsecase: UpsertBudgetUsecase) {}

  upsertBudget(input: IUpsertBudgetInput, user: User): Promise<IUpsertBudgetOutput> {
    return this.upsertBudgetUsecase.execute(input, user);
  }
}
