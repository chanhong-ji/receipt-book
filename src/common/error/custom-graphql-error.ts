import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

interface CustomErrorExtensions extends GraphQLErrorExtensions {
  level: 'log' | 'warn' | 'error';
}

export class CustomGraphQLError extends GraphQLError {
  constructor(message: string, extensions: CustomErrorExtensions) {
    super(message, { extensions });
  }
}
