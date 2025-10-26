import { Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from '../../application/budget.repository';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { IDeleteBudgetInput } from '../../application/dtos/delete-budget.dto';

@Injectable()
export class DeleteBudgetUsecase {
  constructor(
    @Inject('BudgetRepository') private readonly budgetRepository: BudgetRepository,
    private readonly errorService: ErrorService,
  ) {}

  async execute(input: IDeleteBudgetInput, user: User): Promise<void> {
    const budget = await this.budgetRepository.findById(input.id, user.id);
    if (!budget) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.BUDGET_NOT_FOUND));
    }
    await this.budgetRepository.delete(input.id);
  }
}
