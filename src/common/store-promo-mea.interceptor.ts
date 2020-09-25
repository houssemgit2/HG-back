import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorePromoMeaService } from '../store-promo-mea/store-promo-mea.service';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class StorePromoMeaInterceptor implements NestInterceptor {
  constructor(private service?: StorePromoMeaService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log('Before...');
    const request = context.switchToHttp().getRequest();
    const user: User = !request || request.user;
    const storeId =
      user.userRoleId === 1 ? request.query.store_id : user.storeId;
    const promoId = parseInt(request.params.id);
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
        console.log(data);
        if (data)
          if (data)
            // TDO add state validation for upload
            return next.handle().pipe(
              tap(() => {
                request.promo = data;
                return request;
              }),
            );
          else
            throw new BadRequestException(
              `store ${storeId} has no promo mea ${promoId}`,
            );
      });
  }
}
