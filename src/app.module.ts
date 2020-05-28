import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { PromoModule } from './promo/promo.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import entities from './entities';
import { from } from 'rxjs';
import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';
import { LefletPeriodModule } from './leflet-period/leflet-period.module';
import { LeafletModule } from './leaflet/leaflet.module';
import { OrderUploadModule } from './order-upload/order-upload.module';
import { ConfigModule } from '@nestjs/config';
import { AccessPermissionsModule } from './access-permissions/access-permissions.module';
import { RejectionReasonModule } from './rejection-reason/rejection-reason.module';
import { StorePromoSelectedModule } from './store-promo-selected/store-promo-selected.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: true,
      name: 'default',
      type: 'mysql',
      host:
        'hg-referentiel-dev-instance-1.ceia1tvbrwoq.eu-west-3.rds.amazonaws.com',
      port: 3306,
      username: 'hgbetaUser',
      password: 'AZcLpafyKMG6HPxs',
      database: 'hg_promo_beta',
      synchronize: false,
      entities: entities,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StoreModule,
    UserModule,
    PdfPromoGeneratorModule,
    PromoModule,
    LefletPeriodModule,
    LeafletModule,
    OrderUploadModule,
    AccessPermissionsModule,
    RejectionReasonModule,
    StorePromoSelectedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.ALL });
  }
}
