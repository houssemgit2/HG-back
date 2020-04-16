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
    AuthModule,
    StoreModule,
    UserModule,
    PromoModule,
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
