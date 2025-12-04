import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import { CREATE_USER_MUTATION, LOGIN_MUTATION, ME_QUERY, LOGOUT_MUTATION } from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';

describe('인증 흐름 E2E', () => {
  let app: INestApplication;
  let userData: { email: string; password: string; name: string };
  let userId: number;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    userData = TestDataFactory.createUserData(`_${Date.now()}`);
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('회원가입 -> 로그인 -> 사용자 정보 조회 -> 로그아웃 흐름', () => {
    it('1단계: 회원가입이 성공해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_USER_MUTATION,
          variables: {
            CreateUserInput: userData,
          },
        })
        .expect(200);

      expect(response.body.data.createUser.ok).toBe(true);
      expect(response.body.data.createUser.userId).toBeDefined();
      expect(response.body.data.createUser.error).toBeNull();

      userId = response.body.data.createUser.userId;
    });

    it('2단계: 생성한 계정으로 로그인이 성공해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: LOGIN_MUTATION,
          variables: {
            LoginInput: {
              email: userData.email,
              password: userData.password,
            },
          },
        })
        .expect(200);

      expect(response.body.data.login.ok).toBe(true);
      expect(response.body.data.login.userId).toBe(userId);
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.error).toBeNull();

      token = response.body.data.login.token;
    });

    it('3단계: 토큰으로 사용자 정보를 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: ME_QUERY,
        })
        .expect(200);

      expect(response.body.data.me.ok).toBe(true);
      expect(response.body.data.me.user).toBeDefined();
      expect(response.body.data.me.user.id).toBe(userId);
      expect(response.body.data.me.user.email).toBe(userData.email);
      expect(response.body.data.me.user.name).toBe(userData.name);
      expect(response.body.data.me.error).toBeNull();
    });

    it('4단계: 로그아웃이 성공해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: LOGOUT_MUTATION,
        })
        .expect(200);

      expect(response.body.data.logout).toBe(true);
    });
  });
});
