import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { StorePromoMea } from 'src/entities/StorePromoMea';

import { getConnection } from 'typeorm';

export const CLIENT = 'client';
export const ADMIN = 'admin';

@Injectable()
export class StorePromoMeaGuard implements CanActivate {
  logger = new Logger('Client Guard canActivate');

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const promoId = parseInt(request.params.id);
    const storeId =
      user.userRole.name === ADMIN
        ? request.query.store_id || request.body.sotre_id
        : user.storeId;
    return getConnection()
      .createQueryBuilder()
      .select('spm') // table, Entity, key
      .from(StorePromoMea, 'spm')
      .where(`promo_id =:promoId and store_id =:storeId`, {
        promoId,
        storeId,
      })
      .getOne()
      .catch(e => {
        throw new InternalServerErrorException(e);
      })
      .then(data => {
        if (data) return true;
        else
          throw new NotFoundException(
            `store ${storeId} has no  promo ${promoId} `,
          );
      });
  }
}
