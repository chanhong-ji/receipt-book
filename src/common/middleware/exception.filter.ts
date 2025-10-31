import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';
import { CustomGraphQLError } from '../error/custom-graphql-error';

@Catch()
export class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const fieldName = gqlHost.getInfo()?.fieldName;
    const user = gqlHost.getContext().user;

    const logData = {
      fieldName,
      code: exception?.extensions?.code || 'UNKNOWN',
      level: exception?.extensions?.level || 'error',
      message: exception.message,
      stack: exception.stack,
      userId: user?.id ?? 'anonymous',
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof CustomGraphQLError) {
      switch (logData.level) {
        case 'log':
          console.log(logData);
          break;
        case 'warn':
          console.warn(logData);
          break;
        case 'error':
        default:
          console.error(logData);
          break;
      }
      return { ok: false, error: logData.message, code: logData.code };
    }

    if (exception instanceof QueryFailedError) {
      console.error('query failed error');
      console.error(logData);
      return {
        ok: false,
        error: '개발자에게 문의하세요.',
      };
    }

    console.error('Unexpected error');
    console.log(logData);

    return {
      ok: false,
      error: '지금은 사용 할 수 없습니다.',
    };
  }
}
