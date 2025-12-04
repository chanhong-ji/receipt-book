import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import {
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_CATEGORY_MUTATION,
  UPSERT_BUDGET_MUTATION,
  FIND_BUDGETS_QUERY,
  DELETE_BUDGET_MUTATION,
} from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';

describe('예산 CRUD 흐름 E2E', () => {
  let app: INestApplication;
  let token: string;
  let categoryId: number;
  let budgetId: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 사용자 생성 및 로그인
    const userData = TestDataFactory.createUserData(`_budget_${Date.now()}`);
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

    // 테스트용 카테고리 생성
    const categoryResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: CREATE_CATEGORY_MUTATION,
        variables: { CreateCategoryInput: { name: '식비' } },
      });

    categoryId = categoryResponse.body.data.createCategory.category.id;
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('예산 생성(Upsert) -> 조회 -> 수정 -> 삭제 흐름', () => {
    it('1단계: 카테고리별 예산을 생성해야 함', async () => {
      const budgetData = TestDataFactory.createBudgetData({
        year: 2024,
        month: 1,
        totalAmount: 500000,
        categoryId,
      });

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPSERT_BUDGET_MUTATION,
          variables: { UpsertBudgetInput: budgetData },
        })
        .expect(200);

      expect(response.body.data.upsertBudget.ok).toBe(true);
      expect(response.body.data.upsertBudget.budget).toBeDefined();
      expect(response.body.data.upsertBudget.budget.yearMonth).toBeDefined();

      budgetId = response.body.data.upsertBudget.budget.id;
    });

    it('2단계: 생성된 예산을 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_BUDGETS_QUERY,
          variables: {
            FindBudgetInput: {
              year: 2024,
              month: 1,
            },
          },
        })
        .expect(200);

      expect(response.body.data.findBudgets.ok).toBe(true);
      expect(response.body.data.findBudgets.budgets).toBeDefined();
      expect(response.body.data.findBudgets.budgets.length).toBeGreaterThan(0);

      const budget = response.body.data.findBudgets.budgets.find((b: any) => b.id === budgetId);
      expect(budget).toBeDefined();
      expect(budget.yearMonth).toBe('2024-01-01');
      expect(budget.totalAmount).toBe(500000);
      expect(budget.category.id).toBe(categoryId);
      expect(budget.category.name).toBe('식비');
    });

    it('3단계: 같은 카테고리와 연월로 Upsert 시 기존 예산이 수정되어야 함', async () => {
      const budgetData = TestDataFactory.createBudgetData({
        year: 2024,
        month: 1,
        totalAmount: 600000, // 금액 변경
        categoryId,
      });

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPSERT_BUDGET_MUTATION,
          variables: { UpsertBudgetInput: budgetData },
        })
        .expect(200);

      expect(response.body.data.upsertBudget.ok).toBe(true);
      expect(response.body.data.upsertBudget.budget).toBeDefined();
      expect(response.body.data.upsertBudget.budget.totalAmount).toBe(600000);

      // ID가 동일해야 함 (업데이트되었음을 확인)
      expect(response.body.data.upsertBudget.budget.id).toBe(budgetId);
    });

    it('4단계: 수정된 예산이 조회에 반영되어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_BUDGETS_QUERY,
          variables: {
            FindBudgetInput: {
              year: 2024,
              month: 1,
            },
          },
        })
        .expect(200);

      const budget = response.body.data.findBudgets.budgets.find((b: any) => b.id === budgetId);
      expect(budget).toBeDefined();
      expect(budget.totalAmount).toBe(600000);
    });

    it('5단계: 예산을 삭제해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: DELETE_BUDGET_MUTATION,
          variables: {
            DeleteBudgetInput: { id: budgetId },
          },
        })
        .expect(200);

      expect(response.body.data.deleteBudget.ok).toBe(true);
    });

    it('6단계: 삭제된 예산은 조회되지 않아야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_BUDGETS_QUERY,
          variables: {
            FindBudgetInput: {
              year: 2024,
              month: 1,
            },
          },
        })
        .expect(200);

      const budget = response.body.data.findBudgets.budgets.find((b: any) => b.id === budgetId);
      expect(budget).toBeUndefined();
    });
  });

  describe('다양한 예산 시나리오', () => {
    it('같은 월에 여러 카테고리별 예산을 생성할 수 있어야 함', async () => {
      // 두 번째 카테고리 생성
      const category2Response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_CATEGORY_MUTATION,
          variables: { CreateCategoryInput: { name: '교통비' } },
        });

      const categoryId2 = category2Response.body.data.createCategory.category.id;

      // 첫 번째 카테고리 예산
      const budget1Response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPSERT_BUDGET_MUTATION,
          variables: {
            UpsertBudgetInput: {
              year: 2024,
              month: 3,
              totalAmount: 300000,
              categoryId,
            },
          },
        })
        .expect(200);

      expect(budget1Response.body.data.upsertBudget.ok).toBe(true);

      // 두 번째 카테고리 예산
      const budget2Response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPSERT_BUDGET_MUTATION,
          variables: {
            UpsertBudgetInput: {
              year: 2024,
              month: 3,
              totalAmount: 150000,
              categoryId: categoryId2,
            },
          },
        })
        .expect(200);

      expect(budget2Response.body.data.upsertBudget.ok).toBe(true);

      // 3월 예산 조회
      const findResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_BUDGETS_QUERY,
          variables: {
            FindBudgetInput: {
              year: 2024,
              month: 3,
            },
          },
        })
        .expect(200);

      expect(findResponse.body.data.findBudgets.budgets.length).toBeGreaterThanOrEqual(2);
    });
  });
});
