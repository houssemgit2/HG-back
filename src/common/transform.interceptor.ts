import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { convertToSnakeCase } from './utils/helpers';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  logger = new Logger('TransformInterceptor');
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    const pathRequest = context.switchToHttp().getRequest().path;
    const method = context.switchToHttp().getRequest().method;
    let status = context.switchToHttp().getResponse().statusCode;
    console.log('TransformInterceptor');
    console.log(pathRequest);
    if (method === 'POST') status = 200;
    this.logger.verbose(`statusCode:${status} succssefly returning response`);
    if (!pathRequest.includes('login')) {
      // make the response standard {status,data}
      return next.handle().pipe(
        map(data => ({
          statusCode: status,
          data:
            data && data.data
              ? convertToSnakeCase(data.data)
              : convertToSnakeCase(data),
          totalItems: data ? data.totalItem : undefined,
        })),
      );
    } else {
      return next.handle().pipe(map(data => data));
    }
  }
}
