import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

export const CLIENT = 'client';
export const ADMIN = 'admin';
@Injectable()
export class AdminGuard implements CanActivate {
  logger = new Logger('admin Guard canActivate');

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.logger.verbose(`the user is ${user.email}`);
    if (user && user.userRole.name === ADMIN) return true;
    this.logger.error(`you are not admin`);
    throw new UnauthorizedException(
      `you are not allowed to visit this, checkout`,
    );
  }
}
@Injectable()
export class StoreAdminGuard implements CanActivate {
  logger = new Logger('Store admin Guard canActivate');

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storeId =
      request.query.store_id || request.body.store_id || user.storeId;
    this.logger.verbose(`the user is ${user.email}`);
    if (
      user &&
      user.userRole.name === CLIENT &&
      parseInt(storeId) !== user.storeId
    ) {
      this.logger.error(`you can't access to store ${storeId}`);

      throw new UnauthorizedException(
        `you are not allowed to visit this store`,
      );
    }
    // if (user && user.userRole.name === ADMIN && !storeId)
    //   throw new UnauthorizedException(`please provide the store_id`);
    this.logger.debug(`access allowed to store ${storeId}`);
    return true;
  }
}
