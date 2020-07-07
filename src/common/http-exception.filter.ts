import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.error('*****************************************');
    console.log('http expectation');
    console.log(process.env.NODE_ENV);
    const ctx = host.switchToHttp();
    const res: any = {};
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    res.status = status;
    res.timestamp = new Date().toISOString();
    if (process.env.NODE_ENV === 'development') res.stack = exception.stack;
    res.message = exception.message;
    console.log(exception);
    response.status(status).json(res);
  }
}
