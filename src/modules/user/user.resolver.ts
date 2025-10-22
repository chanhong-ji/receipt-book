import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserFactory } from './domain/user.factory';
import { Public } from 'src/common/auth/decorator/public.decorator';
import { CreateUserInput, CreateUserOutput } from './presentation/dtos/create-user.dto';
import { LoginInput, LoginOutput } from './presentation/dtos/login.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly factory: UserFactory) {}

  @Query(() => Boolean)
  async test(): Promise<boolean> {
    return true;
  }

  @Public()
  @Mutation(() => CreateUserOutput)
  async createUser(@Args('CreateUserInput') input: CreateUserInput): Promise<CreateUserOutput> {
    const user = await this.factory.createUser(input);
    return {
      ok: true,
      userId: user.id,
    };
  }

  @Public()
  @Mutation(() => LoginOutput)
  async login(@Args('LoginInput') input: LoginInput): Promise<LoginOutput> {
    const { userId, token } = await this.factory.login(input);
    return {
      userId,
      token,
    };
  }
}
