import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpServer,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToSnakeCase } from './utils/helpers';

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
    console.log(pathRequest);
    if (!pathRequest.includes('login')) {
      if (pathRequest === '/v1/promos/promo-mea')
        return next.handle().pipe(
          map(data => ({
            statusCode: context.switchToHttp().getResponse().statusCode,
            data: convertToSnakeCase(data.data),
            totlaItem: data.totalItem,
          })),
        );
      return next.handle().pipe(
        map(data => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: convertToSnakeCase(data),
        })),
      );
    } else return next.handle().pipe(map(data => data));
  }
}
