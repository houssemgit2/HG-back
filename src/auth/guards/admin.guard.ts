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
    if (user && user.userRole.name === ADMIN) return true;
    this.logger.error(`you are not admin`);
    throw new UnauthorizedException(
      `you are not allowed to visit this, checkout`,
    );
  }
}