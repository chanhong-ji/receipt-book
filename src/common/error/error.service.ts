import { Injectable } from '@nestjs/common';

export enum ErrorCode {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  MERCHANT_NOT_FOUND = 'MERCHANT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PASSWORD_WRONG = 'PASSWORD_WRONG',
}

export interface ErrorDetail {
  code: ErrorCode;
  description: string;
  statusCode?: number;
  logLevel?: 'log' | 'warn' | 'error';
}

@Injectable()
export class ErrorService {
  private readonly errorDetails: Record<ErrorCode, ErrorDetail> = {
    [ErrorCode.EMAIL_ALREADY_EXISTS]: {
      code: ErrorCode.EMAIL_ALREADY_EXISTS,
      description: '이미 존재하는 이메일입니다',
      statusCode: 400,
      logLevel: 'log',
    },
    [ErrorCode.NOT_AUTHENTICATED]: {
      code: ErrorCode.NOT_AUTHENTICATED,
      description: '인증이 필요합니다',
      statusCode: 401,
      logLevel: 'warn',
    },
    [ErrorCode.NOT_AUTHORIZED]: {
      code: ErrorCode.NOT_AUTHORIZED,
      description: '접근 권한이 없습니다',
      statusCode: 403,
      logLevel: 'warn',
    },
    [ErrorCode.CATEGORY_NOT_FOUND]: {
      code: ErrorCode.CATEGORY_NOT_FOUND,
      description: '카테고리를 찾을 수 없습니다',
      statusCode: 404,
      logLevel: 'warn',
    },
    [ErrorCode.MERCHANT_NOT_FOUND]: {
      code: ErrorCode.MERCHANT_NOT_FOUND,
      description: '판매자를 찾을 수 없습니다',
      statusCode: 404,
      logLevel: 'warn',
    },
    [ErrorCode.USER_NOT_FOUND]: {
      code: ErrorCode.USER_NOT_FOUND,
      description: '사용자를 찾을 수 없습니다',
      statusCode: 404,
      logLevel: 'log',
    },
    [ErrorCode.PERMISSION_DENIED]: {
      code: ErrorCode.PERMISSION_DENIED,
      description: '권한이 거부되었습니다',
      statusCode: 403,
      logLevel: 'log',
    },
    [ErrorCode.PASSWORD_WRONG]: {
      code: ErrorCode.PASSWORD_WRONG,
      description: '비밀번호가 일치하지 않습니다',
      statusCode: 401,
      logLevel: 'log',
    },
  };

  get(code: ErrorCode): ErrorDetail {
    return this.errorDetails[code];
  }
}
