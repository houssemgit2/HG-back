import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { PromoModule } from './promo/promo.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AuthModule, StoreModule, UserModule, PromoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
