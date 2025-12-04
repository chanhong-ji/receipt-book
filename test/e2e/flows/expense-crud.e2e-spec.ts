import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import {
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_CATEGORY_MUTATION,
  CREATE_ACCOUNT_MUTATION,
  CREATE_EXPENSE_MUTATION,
  UPDATE_EXPENSE_MUTATION,
  FIND_EXPENSE_MONTHLY_QUERY,
  DELETE_EXPENSE_MUTATION,
} from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';
import { AccountType } from '../../../src/modules/user/domain/enum/account.enum';

describe('지출 CRUD 흐름 E2E', () => {
  let app: INestApplication;
  let token: string;
  let categoryId: number;
  let accountId: number;
  let expenseId: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 사용자 생성 및 로그인
    const userData = TestDataFactory.createUserData(`_expense_${Date.now()}`);
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: CREATE_USER_MUTATION,
        variables: { CreateUserInput: userData },
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: LOGIN_MUTATION,
        variables: {
          LoginInput: {
            email: userData.email,
            password: userData.password,
          },
        },
      });

    token = loginResponse.body.data.login.token;
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('지출 생성 -> 수정 -> 조회 -> 삭제 흐름', () => {
    it('1단계: 카테고리를 생성해야 함', async () => {
      const categoryData = TestDataFactory.createCategoryData('교통비');

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_CATEGORY_MUTATION,
          variables: { CreateCategoryInput: categoryData },
        })
        .expect(200);

      expect(response.body.data.createCategory.ok).toBe(true);
      expect(response.body.data.createCategory.category).toBeDefined();
      expect(response.body.data.createCategory.category.name).toBe('교통비');

      categoryId = response.body.data.createCategory.category.id;
    });

    it('2단계: 계좌를 생성해야 함', async () => {
      const accountData = TestDataFactory.createAccountData('국민카드', AccountType.CARD);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_ACCOUNT_MUTATION,
          variables: { CreateAccountInput: accountData },
        })
        .expect(200);

      expect(response.body.data.createAccount.ok).toBe(true);
      expect(response.body.data.createAccount.account).toBeDefined();
      expect(response.body.data.createAccount.account.name).toBe('국민카드');

      accountId = response.body.data.createAccount.account.id;
    });

    it('3단계: 지출을 생성해야 함', async () => {
      const expenseData = TestDataFactory.createExpenseData({
        name: '택시비',
        amount: 12000,
        postedAt: new Date('2024-01-15'),
        accountId,
        categoryId,
        merchantText: '카카오택시',
        memo: '집에서 회사',
      });

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_EXPENSE_MUTATION,
          variables: { CreateExpenseInput: expenseData },
        })
        .expect(200);

      expect(response.body.data.createExpense.ok).toBe(true);
      expect(response.body.data.createExpense.expense).toBeDefined();
      expect(response.body.data.createExpense.expense.name).toBe('택시비');
      expect(response.body.data.createExpense.expense.amount).toBe(12000);
      expect(response.body.data.createExpense.expense.accountId).toBe(accountId);
      expect(response.body.data.createExpense.expense.categoryId).toBe(categoryId);

      expenseId = response.body.data.createExpense.expense.id;
    });

    it('4단계: 지출을 수정해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPDATE_EXPENSE_MUTATION,
          variables: {
            UpdateExpenseInput: {
              id: expenseId,
              name: '버스비',
              amount: 5000,
              memo: '수정된 메모',
            },
          },
        })
        .expect(200);

      expect(response.body.data.updateExpense.ok).toBe(true);
      expect(response.body.data.updateExpense.expense).toBeDefined();
      expect(response.body.data.updateExpense.expense.name).toBe('버스비');
      expect(response.body.data.updateExpense.expense.amount).toBe(5000);
      expect(response.body.data.updateExpense.expense.memo).toBe('수정된 메모');
    });

    it('5단계: 월별 지출을 조회해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_EXPENSE_MONTHLY_QUERY,
          variables: {
            FindExpenseMonthlyInput: {
              year: 2024,
              month: 1,
              skip: 0,
              take: 10,
            },
          },
        })
        .expect(200);

      expect(response.body.data.findExpenseMonthly.ok).toBe(true);
      expect(response.body.data.findExpenseMonthly.expenses).toBeDefined();
      expect(response.body.data.findExpenseMonthly.expenses.length).toBeGreaterThan(0);
      expect(response.body.data.findExpenseMonthly.totalCount).toBeGreaterThan(0);

      const expense = response.body.data.findExpenseMonthly.expenses.find((e: any) => e.id === expenseId);
      expect(expense).toBeDefined();
      expect(expense.name).toBe('버스비');
    });

    it('6단계: 지출을 삭제해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: DELETE_EXPENSE_MUTATION,
          variables: {
            DeleteExpenseInput: { id: expenseId },
          },
        })
        .expect(200);

      expect(response.body.data.deleteExpense.ok).toBe(true);
    });

    it('7단계: 삭제된 지출은 조회되지 않아야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_EXPENSE_MONTHLY_QUERY,
          variables: {
            FindExpenseMonthlyInput: {
              year: 2024,
              month: 1,
              skip: 0,
              take: 10,
            },
          },
        })
        .expect(200);

      const expense = response.body.data.findExpenseMonthly.expenses.find((e: any) => e.id === expenseId);
      expect(expense).toBeUndefined();
    });
  });
});
