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
import { Logger } from '@nestjs/common';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  logger = new Logger('TransformInterceptor');
  private httpServer: HttpServer;
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    const pathRequest = context.switchToHttp().getRequest().path;
    const method = context.switchToHttp().getRequest().method;
    const request = context.switchToHttp().getRequest().request;
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
          // code: status, // TODO keep just the statusCode and front team has to use statusCode
          data:
            data && data.data
              ? convertToSnakeCase(data.data)
              : convertToSnakeCase(data),
          totalItems: data.totalItem,
        })),
      );
    } else {
      return next.handle().pipe(map(data => data));
    }
  }
}
