import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('http');
    use(req: Request, res: Response, next: Function) {
        this.logger.debug(`${req.user}   ${req.path}`);
        next();
    }
}
