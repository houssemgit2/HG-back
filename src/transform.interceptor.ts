import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpServer,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as snakeCaseKeys from 'snakecase-keys';
import { _ } from 'lodash';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private httpServer: HttpServer;
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    const pathRequest = context.switchToHttp().getRequest().path;
    if (!pathRequest.includes('login')) {
      return next.handle().pipe(
        map(data => {
          const { isObject, isArray } = _;
          const result = {
            statusCode: context.switchToHttp().getResponse().statusCode,
            data: {},
          };

          if (isArray(data)) {
            result.data = data.map(innerObj => snakeCaseKeys(innerObj));
          } else if (isObject(data)) {
            result.data = snakeCaseKeys(data);
          } else {
            result.data = data;
          }
          return result;
        }),
      );
    } else return next.handle().pipe(map(data => data));
  }
}
