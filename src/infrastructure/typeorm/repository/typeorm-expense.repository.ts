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
}
