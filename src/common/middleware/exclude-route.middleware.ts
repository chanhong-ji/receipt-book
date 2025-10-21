import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ExcludeRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedPaths = ['/graphql', '/health'];
    const [path, queryString] = req.originalUrl.split('?');

    if (!allowedPaths.includes(path)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (path === '/health') {
      return res.status(200).json({ message: 'hello world' });
    }
    next();
  }
}
