import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReqWithUser } from 'src/auth/interface/user.interface';
import { UserReq } from 'src/auth/get-user.decorator';
import { User } from 'src/entities/User';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('http');
  use(req: ReqWithUser, res: Response, next: Function) {
    this.logger.debug(`${req.user || ''}   ${req.path}`);
    next();
  }
}
