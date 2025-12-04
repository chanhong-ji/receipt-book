import { AccountType } from '../../../src/modules/user/domain/enum/account.enum';

export class TestDataFactory {
  static createUserData(suffix = '') {
    return {
      email: `test${suffix}@example.com`,
      password: 'password123!',
      name: `테스트유저${suffix}`,
    };
  }

  static createCategoryData(name = '식비') {
    return {
      name,
    };
  }

  static createAccountData(name = '신한카드', type = AccountType.CARD) {
    return {
      name,
      type,
    };
  }

  static createExpenseData(params: {
    name?: string;
    amount?: number;
    postedAt?: Date;
    accountId: number;
    categoryId?: number;
    merchantText?: string;
    memo?: string;
  }) {
    return {
      name: params.name || '저녁식사',
      amount: params.amount || 15000,
      postedAt: params.postedAt || new Date(),
      accountId: params.accountId,
      categoryId: params.categoryId,
      merchantText: params.merchantText || '맛있는 식당',
      memo: params.memo || '테스트 메모',
    };
  }

  static createBudgetData(params: {
    year: number;
    month: number;
    totalAmount: number;
    categoryId?: number;
  }) {
    return {
      year: params.year,
      month: params.month,
      totalAmount: params.totalAmount,
      categoryId: params.categoryId,
    };
  }

  static getRandomEmail() {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
  }

  static getRandomString(prefix = 'test') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

