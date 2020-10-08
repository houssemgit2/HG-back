import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';

import { StorePromoMeaService } from '../../store-promo-mea/store-promo-mea.service';

@Injectable()
export class StorePromoMeaMiddleware implements NestMiddleware {
  // TODO we need user here but Guards are executed after each middleware, but before any interceptor or pipe.
  constructor(private service: StorePromoMeaService) {}
  use(req: Request, res: Response, next: Function) {
    // this.service.validatePromoState(parseInt(req.params.id), 21);
    // throw new InternalServerErrorException('stupid error test ');
    next();
  }
}
