import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { StorePromoMeaController } from './store-promo-mea.controller';
import { StorePromoMeaService } from './store-promo-mea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorePromoMeaRepository } from './store-promo-mea.repository';
import { AuthModule } from '../auth/auth.module';
import { RejectionReasonRepository } from '../rejection-reason/rejection-reason.repository';
import { StorePromoMeaMiddleware } from '../common/middleware/store-promo-mea.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StorePromoMeaRepository,
      RejectionReasonRepository,
    ]),
    AuthModule,
  ],

  controllers: [StorePromoMeaController],
  exports: [StorePromoMeaService],
  providers: [StorePromoMeaService],
})
export class StorePromoMeaModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(StorePromoMeaMiddleware).forRoutes({
      path: 'promos/promo-mea/:id',
      method: RequestMethod.POST,
    });
  }
}
