import { Resolver } from '@nestjs/graphql';
import { BudgetFactory } from '../domain/budget.factory';

@Resolver()
export class BudgetResolver {
  constructor(private readonly factory: BudgetFactory) {}
}
