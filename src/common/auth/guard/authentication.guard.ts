import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/modules/user/application/user.repository';
import { CustomGraphQLError } from 'src/common/error/custom-graphql-error';
import { ErrorCode, ErrorService } from 'src/common/error/error.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const request = gqlContext.req;
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.NOT_AUTHENTICATED));
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const { userId } = payload;
      const user = await this.userRepository.findById(userId);
      request['user'] = user;
    } catch {
      throw new CustomGraphQLError(this.errorService.get(ErrorCode.NOT_AUTHENTICATED));
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  extractTokenFromCookie(request: Request): string | undefined {
    const cookieName = this.configService.get('auth.cookie.name') as string;
    return request.cookies?.[cookieName];
  }
}
