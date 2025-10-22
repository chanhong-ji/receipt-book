import { GraphQLError } from 'graphql';
import { ErrorDetail } from './error.service';

export class CustomGraphQLError extends GraphQLError {
  constructor(errorDetail: ErrorDetail) {
    super(errorDetail.code, {
      extensions: {
        level: errorDetail.logLevel,
        statusCode: errorDetail.statusCode,
        description: errorDetail.description,
        code: errorDetail.code,
      },
    });
  }
}
