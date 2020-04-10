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
  logger = new Logger('admin Gaurd canActivate');

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    this.logger.verbose(`the user is ${user.email}`);
    if (user && user.userRole.name === ADMIN) return true;
    this.logger.error(`you'r not admin`);
    throw new UnauthorizedException(
      `you'r not allowed to visit this, checkout`,
    );
  }
}
