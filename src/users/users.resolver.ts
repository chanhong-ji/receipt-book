import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  constructor() {}

  @Query(() => String)
  test(): string {
    return 'test';
  }
}
