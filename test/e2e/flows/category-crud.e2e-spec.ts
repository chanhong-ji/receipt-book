import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import {
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_CATEGORY_MUTATION,
  FIND_CATEGORIES_QUERY,
  UPDATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
} from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';

describe('카테고리 CRUD 흐름 E2E', () => {
  let app: INestApplication;
  let token: string;
  let categoryId: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 사용자 생성 및 로그인
    const userData = TestDataFactory.createUserData(`_category_${Date.now()}`);
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

  describe('카테고리 생성 -> 조회 -> 수정 -> 삭제 흐름', () => {
    it('1단계: 카테고리를 생성해야 함', async () => {
      const categoryData = TestDataFactory.createCategoryData('식비');

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
      expect(response.body.data.createCategory.category.name).toBe('식비');

      categoryId = response.body.data.createCategory.category.id;
    });

    it('2단계: 카테고리 목록을 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_CATEGORIES_QUERY,
        })
        .expect(200);

      expect(response.body.data.findCategories.ok).toBe(true);
      expect(response.body.data.findCategories.categories).toBeDefined();
      expect(response.body.data.findCategories.categories.length).toBeGreaterThan(0);

      const category = response.body.data.findCategories.categories.find((c: any) => c.id === categoryId);
      expect(category).toBeDefined();
      expect(category.name).toBe('식비');
    });

    it('3단계: 카테고리를 수정해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPDATE_CATEGORY_MUTATION,
          variables: {
            UpdateCategoryInput: {
              id: categoryId,
              name: '외식비',
            },
          },
        })
        .expect(200);

      expect(response.body.data.updateCategory.ok).toBe(true);
      expect(response.body.data.updateCategory.category).toBeDefined();
      expect(response.body.data.updateCategory.category.id).toBe(categoryId);
      expect(response.body.data.updateCategory.category.name).toBe('외식비');
    });

    it('4단계: 수정된 카테고리가 목록에 반영되어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_CATEGORIES_QUERY,
        })
        .expect(200);

      const category = response.body.data.findCategories.categories.find((c: any) => c.id === categoryId);
      expect(category).toBeDefined();
      expect(category.name).toBe('외식비');
    });

    it('5단계: 카테고리를 삭제해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: DELETE_CATEGORY_MUTATION,
          variables: {
            DeleteCategoryInput: { id: categoryId },
          },
        })
        .expect(200);

      expect(response.body.data.deleteCategory.ok).toBe(true);
    });

    it('6단계: 삭제된 카테고리는 목록에서 조회되지 않아야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_CATEGORIES_QUERY,
        })
        .expect(200);

      const category = response.body.data.findCategories.categories.find((c: any) => c.id === categoryId);
      expect(category).toBeUndefined();
    });
  });
});
