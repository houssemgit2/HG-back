import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';

import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { NestEmitterModule } from 'nest-emitter';

import { EventEmitter } from 'events';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './entities';

import { AccessPermissionsModule } from './access-permissions/access-permissions.module';
import { AuthModule } from './auth/auth.module';
import { ClustersModule } from './clusters/clusters.module';
import { CoquePromoModule } from './coque-promo/coque-promo.module';
import { LeafletModule } from './leaflet/leaflet.module';
import { LefletPeriodModule } from './leflet-period/leflet-period.module';
import { MeaUploadModule } from './mea-upload/mea-upload.module';
import { OrderUploadModule } from './order-upload/order-upload.module';
import { PromoModule } from './promo/promo.module';
import { RejectionReasonModule } from './rejection-reason/rejection-reason.module';
import { SelectModule } from './select/select.module';
import { StorePromoMeaModule } from './store-promo-mea/store-promo-mea.module';
import { StorePromoSelectedModule } from './store-promo-selected/store-promo-selected.module';
import { StoreModule } from './store/store.module';
import { SupportModule } from './support/support.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { config } from './environments/environment';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: config.dbLogging,
      name: 'default',
      type: 'mysql',
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPassword,
      database: config.database,
      synchronize: false,
      entities: entities,
      // migrationsTableName: 'custom_migration_table',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
    StorePromoMeaModule,
    MeaUploadModule,
    CoquePromoModule,
    ClustersModule,
    SupportModule,
    SelectModule,
    NestEmitterModule.forRoot(new EventEmitter()),
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
