import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserFactory } from '../domain/user.factory';
import { Public } from 'src/common/auth/decorator/public.decorator';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../domain/entity/user.entity';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { MeOutput } from './dtos/me.dto';
import { CookieOptions, Response } from 'express';

@Resolver()
export class UserResolver {
  constructor(
    private readonly factory: UserFactory,
    private readonly configService: ConfigService,
  ) {}

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
  async login(@Args('LoginInput') input: LoginInput, @Context('res') res: Response): Promise<LoginOutput> {
    const { userId, token } = await this.factory.login(input);

    const cookieName = this.configService.get('auth.cookie.name') as string;
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: this.configService.get('auth.cookie.expiresIn'),
    } as CookieOptions;

    res.cookie(cookieName, token, cookieOptions);

    return {
      ok: true,
      userId,
      token,
    };
  }

  @Query(() => MeOutput)
  async me(@AuthUser() user: User): Promise<MeOutput> {
    const me = await this.factory.me(user);
    return {
      ok: true,
      user: me.user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Context('res') res: Response): Promise<boolean> {
    const cookieName = this.configService.get('auth.cookie.name') as string;
    res.clearCookie(cookieName);
    return true;
  }
}
