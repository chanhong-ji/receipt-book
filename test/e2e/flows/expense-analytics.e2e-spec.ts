import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import {
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_CATEGORY_MUTATION,
  CREATE_ACCOUNT_MUTATION,
  CREATE_EXPENSE_MUTATION,
  FIND_MONTHLY_EXPENSE_TOTAL_QUERY,
  FIND_CATEGORY_MONTHLY_EXPENSE_QUERY,
  FIND_SUMMARY_QUERY,
} from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';
import { AccountType } from '../../../src/modules/user/domain/enum/account.enum';

describe('지출 분석 흐름 E2E', () => {
  let app: INestApplication;
  let token: string;
  let categoryId1: number;
  let categoryId2: number;
  let accountId: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 사용자 생성 및 로그인
    const userData = TestDataFactory.createUserData(`_analytics_${Date.now()}`);
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

    // 테스트용 카테고리 2개 생성
    const category1Response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: CREATE_CATEGORY_MUTATION,
        variables: { CreateCategoryInput: { name: '식비' } },
      });
    categoryId1 = category1Response.body.data.createCategory.category.id;

    const category2Response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: CREATE_CATEGORY_MUTATION,
        variables: { CreateCategoryInput: { name: '교통비' } },
      });
    categoryId2 = category2Response.body.data.createCategory.category.id;

    // 테스트용 계좌 생성
    const accountResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: CREATE_ACCOUNT_MUTATION,
        variables: {
          CreateAccountInput: {
            name: '테스트카드',
            type: AccountType.CARD,
          },
        },
      });
    accountId = accountResponse.body.data.createAccount.account.id;
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('지출 데이터 생성 -> 월별 합계 조회 -> 카테고리별 조회 -> 요약 조회 흐름', () => {
    it('1단계: 테스트용 지출 데이터를 여러 개 생성해야 함', async () => {
      const expenses = [
        // 2024년 1월
        { name: '점심', amount: 15000, postedAt: new Date('2024-01-10'), categoryId: categoryId1 },
        { name: '저녁', amount: 20000, postedAt: new Date('2024-01-15'), categoryId: categoryId1 },
        { name: '버스', amount: 5000, postedAt: new Date('2024-01-20'), categoryId: categoryId2 },
        // 2024년 2월
        { name: '점심2', amount: 12000, postedAt: new Date('2024-02-05'), categoryId: categoryId1 },
        { name: '택시', amount: 18000, postedAt: new Date('2024-02-10'), categoryId: categoryId2 },
        // 2024년 3월
        { name: '저녁2', amount: 25000, postedAt: new Date('2024-03-05'), categoryId: categoryId1 },
      ];

      for (const expense of expenses) {
        const expenseData = TestDataFactory.createExpenseData({
          ...expense,
          accountId,
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
      }
    });

    it.skip('2단계: 월별 지출 합계를 조회해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_MONTHLY_EXPENSE_TOTAL_QUERY,
          variables: {
            FindMonthlyExpenseTotalInput: {
              year: 2024,
              months: [1, 2, 3],
            },
          },
        })
        .expect(200);

      expect(response.body.data.findMonthlyExpenseTotal.ok).toBe(true);
      expect(response.body.data.findMonthlyExpenseTotal.months).toBeDefined();
      expect(response.body.data.findMonthlyExpenseTotal.months.length).toBeGreaterThan(0);

      // 1월 데이터 확인 (15000 + 20000 + 5000 = 40000)
      const januaryData = response.body.data.findMonthlyExpenseTotal.months.find((m: any) => m.month === 1);
      expect(januaryData).toBeDefined();
      expect(januaryData.totalExpense).toBe(40000);
      expect(januaryData.totalCount).toBe(3);

      // 2월 데이터 확인 (12000 + 18000 = 30000)
      const februaryData = response.body.data.findMonthlyExpenseTotal.months.find((m: any) => m.month === 2);
      expect(februaryData).toBeDefined();
      expect(februaryData.totalExpense).toBe(30000);
      expect(februaryData.totalCount).toBe(2);
    });

    it.skip('3단계: 카테고리별 월별 지출을 조회해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_CATEGORY_MONTHLY_EXPENSE_QUERY,
          variables: {
            FindCategoryMonthlyExpenseInput: {
              year: 2024,
              months: [1, 2],
            },
          },
        })
        .expect(200);

      expect(response.body.data.findCategoryMonthlyExpense.ok).toBe(true);
      expect(response.body.data.findCategoryMonthlyExpense.result).toBeDefined();
      expect(response.body.data.findCategoryMonthlyExpense.result.length).toBeGreaterThan(0);
    });

    it('4단계: 월별 요약 정보를 조회해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_SUMMARY_QUERY,
          variables: {
            FindSummaryInput: {
              thisYear: 2024,
              thisMonth: 2,
            },
          },
        })
        .expect(200);

      expect(response.body.data.findSummary.ok).toBe(true);
      expect(response.body.data.findSummary.summary).toBeDefined();
      expect(response.body.data.findSummary.summary.thisMonthExpense).toBeDefined();
      expect(response.body.data.findSummary.summary.lastMonthExpense).toBeDefined();
      expect(response.body.data.findSummary.summary.topCategory).toBeDefined();

      // 2월 지출 확인
      expect(response.body.data.findSummary.summary.thisMonthExpense).toBe(30000);
      // 1월(지난 달) 지출 확인
      expect(response.body.data.findSummary.summary.lastMonthExpense).toBe(40000);
    });
  });
});
