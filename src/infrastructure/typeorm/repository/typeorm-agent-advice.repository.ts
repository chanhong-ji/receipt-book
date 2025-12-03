import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdviceTag, AdviceType, AgentAdviceModel } from '../models/agent-advice.model';
import { ExpenseModel } from '../models/expense.model';
import { AccountModel } from '../models/account.model';
import { CategoryModel } from '../models/category.model';
import { BudgetModel } from '../models/budget.model';
import { AgentAdviceRepository } from 'src/modules/agent-advice/application/agent-advice.repository';
import { AgentAdvice } from 'src/modules/agent-advice/domain/entity/agent-advice.entity';

@Injectable()
export class TypeormAgentAdviceRepository implements AgentAdviceRepository {
  constructor(
    @InjectRepository(AgentAdviceModel)
    private readonly repository: Repository<AgentAdviceModel>,
  ) {}

  createInputInformation(userId: number): Promise<{
    thisMonthTotalExpense: number;
    thisMonthBudgets: { categoryName: string; totalExpense: number; budget: number }[];
    monthlyExpenseTotals: { month: number; totalExpense: number }[];
    thisMonthExpenses: { name: string; amount: number; postedAt: Date; accountName: string; categoryName: string }[];
  }> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}-01`;

    const em = this.repository.manager;

    const totalExpensePromise = em
      .getRepository(ExpenseModel)
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.year = :year', { year })
      .andWhere('expense.month = :month', { month })
      .getRawOne<{ total: string }>();

    const monthlyTotalsPromise = em
      .getRepository(ExpenseModel)
      .createQueryBuilder('expense')
      .select('expense.month', 'month')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'totalExpense')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.year = :year', { year })
      .groupBy('expense.month')
      .orderBy('expense.month', 'ASC')
      .getRawMany<{ month: number; totalExpense: string }>();

    const thisMonthExpensesPromise = em
      .getRepository(ExpenseModel)
      .createQueryBuilder('expense')
      .innerJoin(AccountModel, 'account', 'account.id = expense.accountId')
      .leftJoin(CategoryModel, 'category', 'category.id = expense.categoryId')
      .select('expense.name', 'name')
      .addSelect('expense.amount', 'amount')
      .addSelect('expense.postedAt', 'postedAt')
      .addSelect('account.name', 'accountName')
      .addSelect('category.name', 'categoryName')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.year = :year', { year })
      .andWhere('expense.month = :month', { month })
      .orderBy('expense.postedAt', 'DESC')
      .addOrderBy('expense.name', 'ASC')
      .getRawMany<{
        name: string;
        amount: number;
        postedAt: Date;
        accountName: string;
        categoryName: string | null;
      }>();

    const thisMonthBudgetsPromise = em
      .getRepository(BudgetModel)
      .createQueryBuilder('budget')
      .innerJoin('budget.category', 'category')
      .leftJoin(
        ExpenseModel,
        'expense',
        'expense.userId = budget.userId AND expense.categoryId = category.id AND expense.year = :year AND expense.month = :month',
        { year, month },
      )
      .select('category.name', 'categoryName')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'totalExpense')
      .addSelect('budget.totalAmount', 'budget')
      .where('budget.userId = :userId', { userId })
      .andWhere('budget.yearMonth = :yearMonth', { yearMonth })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('budget.totalAmount')
      .orderBy('category.name', 'ASC')
      .getRawMany<{ categoryName: string; totalExpense: string; budget: string }>();

    return Promise.all([
      totalExpensePromise,
      monthlyTotalsPromise,
      thisMonthExpensesPromise,
      thisMonthBudgetsPromise,
    ]).then(([totalExpenseRow, monthlyTotalsRows, thisMonthExpensesRows, thisMonthBudgetsRows]) => {
      return {
        thisMonthTotalExpense: Number(totalExpenseRow?.total ?? 0),
        thisMonthBudgets: thisMonthBudgetsRows.map((r) => ({
          categoryName: r.categoryName,
          totalExpense: Number(r.totalExpense ?? 0),
          budget: Number(r.budget ?? 0),
        })),
        monthlyExpenseTotals: monthlyTotalsRows.map((r) => ({
          month: Number(r.month),
          totalExpense: Number(r.totalExpense ?? 0),
        })),
        thisMonthExpenses: thisMonthExpensesRows.map((r) => ({
          name: r.name,
          amount: Number(r.amount),
          postedAt: new Date(r.postedAt),
          accountName: r.accountName,
          categoryName: r.categoryName ?? '',
        })),
      };
    });
  }

  async create(
    advices: {
      type: AdviceType;
      adviceText: string;
      tag?: AdviceTag;
      categoryName?: string;
      periodStart: string;
      periodEnd: string;
    }[],
    userId: number,
  ): Promise<AgentAdvice[]> {
    const savedModels = await this.repository.save(
      advices.map((advice) => this.repository.create({ ...advice, user: { id: userId } })),
    );
    return savedModels.map(this.toEntity);
  }

  toEntity(model: AgentAdviceModel): AgentAdvice {
    const advice = new AgentAdvice();
    advice.id = model.id;
    advice.type = model.type;
    advice.adviceText = model.adviceText;
    advice.tag = model.tag;
    advice.categoryName = model.categoryName;
    advice.periodStart = model.periodStart;
    advice.periodEnd = model.periodEnd;
    return advice;
  }

  async findOneRecentAdvice(userId: number): Promise<AgentAdvice | null> {
    const model = await this.repository.findOne({ where: { user: { id: userId } }, order: { periodEnd: 'DESC' } });
    return model ? this.toEntity(model) : null;
  }

  async findAllAdvices(userId: number): Promise<AgentAdvice[]> {
    const models = await this.repository
      .createQueryBuilder('agent_advice')
      .where(
        'period_start = ' +
          this.repository
            .createQueryBuilder()
            .subQuery()
            .select('MAX(period_start)')
            .from(AgentAdviceModel, 'sub')
            .where('sub.userId = :userId', { userId })
            .getQuery(),
      )
      .andWhere('agent_advice.userId = :userId', { userId })
      .getMany();
    return models.map(this.toEntity);
  }
}
