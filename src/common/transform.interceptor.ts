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
    const method = context.switchToHttp().getRequest().method;
    const request = context.switchToHttp().getRequest().request;
    let status = context.switchToHttp().getResponse().statusCode;
    console.log('TransformInterceptor');
    console.log(pathRequest);
    if (method === 'POST') status = 200;
    if (!pathRequest.includes('login')) {
      // make the response standard {status,data}
      console.log(`statusCode:${status} transforming response format`);
      return next.handle().pipe(
        map(data => ({
          statusCode: status,
          data: convertToSnakeCase(data),
        })),
      );
    } else return next.handle().pipe(map(data => data));
  }
}
