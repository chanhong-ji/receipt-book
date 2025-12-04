import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';
import {
  LOGIN_MUTATION,
  CREATE_USER_MUTATION,
  CREATE_ACCOUNT_MUTATION,
  FIND_ACCOUNTS_QUERY,
  UPDATE_ACCOUNT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
} from '../helpers/graphql-requests';
import { TestDataFactory } from '../helpers/test-data.factory';
import { AccountType } from '../../../src/modules/user/domain/enum/account.enum';

describe('계좌 CRUD 흐름 E2E', () => {
  let app: INestApplication;
  let token: string;
  let accountId: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 사용자 생성 및 로그인
    const userData = TestDataFactory.createUserData(`_account_${Date.now()}`);
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

  describe('계좌 생성 -> 조회 -> 수정 -> 삭제 흐름', () => {
    it('1단계: 계좌를 생성해야 함', async () => {
      const accountData = TestDataFactory.createAccountData('신한카드', AccountType.CARD);

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
      expect(response.body.data.createAccount.account.name).toBe('신한카드');
      expect(response.body.data.createAccount.account.type).toBe(AccountType.CARD);

      accountId = response.body.data.createAccount.account.id;
    });

    it('2단계: 계좌 목록을 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_ACCOUNTS_QUERY,
        })
        .expect(200);

      expect(response.body.data.findAccounts.ok).toBe(true);
      expect(response.body.data.findAccounts.accounts).toBeDefined();
      expect(response.body.data.findAccounts.accounts.length).toBeGreaterThan(0);

      const account = response.body.data.findAccounts.accounts.find((a: any) => a.id === accountId);
      expect(account).toBeDefined();
      expect(account.name).toBe('신한카드');
      expect(account.type).toBe(AccountType.CARD);
      expect(account.isActive).toBe(true);
    });

    it('3단계: 계좌를 수정해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPDATE_ACCOUNT_MUTATION,
          variables: {
            UpdateAccountInput: {
              id: accountId,
              name: '신한체크카드',
              type: AccountType.CARD,
              isActive: true,
            },
          },
        })
        .expect(200);

      expect(response.body.data.updateAccount.ok).toBe(true);
      expect(response.body.data.updateAccount.account).toBeDefined();
      expect(response.body.data.updateAccount.account.id).toBe(accountId);
      expect(response.body.data.updateAccount.account.name).toBe('신한체크카드');
      expect(response.body.data.updateAccount.account.type).toBe(AccountType.CARD);
    });

    it('4단계: 계좌를 비활성화할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: UPDATE_ACCOUNT_MUTATION,
          variables: {
            UpdateAccountInput: {
              id: accountId,
              isActive: false,
            },
          },
        })
        .expect(200);

      expect(response.body.data.updateAccount.ok).toBe(true);
      expect(response.body.data.updateAccount.account.isActive).toBe(false);
    });

    it('5단계: 수정된 계좌가 목록에 반영되어야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_ACCOUNTS_QUERY,
        })
        .expect(200);

      const account = response.body.data.findAccounts.accounts.find((a: any) => a.id === accountId);
      expect(account).toBeDefined();
      expect(account.name).toBe('신한체크카드');
      expect(account.isActive).toBe(false);
    });

    it('6단계: 계좌를 삭제해야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: DELETE_ACCOUNT_MUTATION,
          variables: {
            DeleteAccountInput: { id: accountId },
          },
        })
        .expect(200);

      expect(response.body.data.deleteAccount.ok).toBe(true);
    });

    it('7단계: 삭제된 계좌는 목록에서 조회되지 않아야 함', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: FIND_ACCOUNTS_QUERY,
        })
        .expect(200);

      const account = response.body.data.findAccounts.accounts.find((a: any) => a.id === accountId);
      expect(account).toBeUndefined();
    });
  });

  describe('다양한 계좌 타입 생성', () => {
    it('BANK 타입 계좌를 생성할 수 있어야 함', async () => {
      const accountData = TestDataFactory.createAccountData('우리은행', AccountType.BANK);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_ACCOUNT_MUTATION,
          variables: { CreateAccountInput: accountData },
        })
        .expect(200);

      expect(response.body.data.createAccount.ok).toBe(true);
      expect(response.body.data.createAccount.account.type).toBe(AccountType.BANK);
    });

    it('CASH 타입 계좌를 생성할 수 있어야 함', async () => {
      const accountData = TestDataFactory.createAccountData('현금', AccountType.CASH);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: CREATE_ACCOUNT_MUTATION,
          variables: { CreateAccountInput: accountData },
        })
        .expect(200);

      expect(response.body.data.createAccount.ok).toBe(true);
      expect(response.body.data.createAccount.account.type).toBe(AccountType.CASH);
    });
  });
});
