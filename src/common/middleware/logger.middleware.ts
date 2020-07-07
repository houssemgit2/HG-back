import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ReqWithUser } from 'src/auth/interface/user.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('http');
  use(req: ReqWithUser, res: Response, next: Function) {
    this.logger.debug(`${req.user || ''}   ${req.path}`);
    next();
  }
}
