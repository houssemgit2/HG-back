import {
  Injectable,
  NestMiddleware,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StorePromoMeaService } from '../../store-promo-mea/store-promo-mea.service';
import { UserReq } from '../../auth/get-user.decorator';
import { UseGuards } from '@nestjs/common';

@Injectable()
export class StorePromoMeaMiddleware implements NestMiddleware {
  // TODO we need user here but Guards are executed after each middleware, but before any interceptor or pipe.
  constructor(private service: StorePromoMeaService) {}
  private logger = new Logger('http');
  use(req: Request, res: Response, next: Function) {
    console.log('--> --> --> --> from StorePromoMeaMiddleware');
    this.logger.debug(`${req.user}   ${5}`);
    this.service.validatePromoState(parseInt(req.params.id), 21);
    // throw new InternalServerErrorException('stupid error test ');
    next();
  }
}
