import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

export const USER_LOGGER = 'client';
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
      request.query.store_id ||
      request.body.store_id ||
      request.query.storeId ||
      request.body.storeId ||
      user.storeId;
    this.logger.verbose(`the user is ${user.email}`);
    if (
      user &&
      user.userRole.name === USER_LOGGER &&
      parseInt(storeId) !== user.storeId
    ) {
      this.logger.error(
        `your store id is ${user.storeId}, you can't access ${storeId} Just admin can access any store,and you are ${user.userRole.name}`,
      );

      throw new UnauthorizedException(
        `you are not allowed to visit this store`,
      );
    }
    // if (user && user.userRole.name === ADMIN && !storeId)
    //   throw new UnauthorizedException(`please provide the store_id`);
    this.logger.debug(
      `Just admin can access any store,and you are ${user.userRole.name}`,
    );
    return true;
  }
}
