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
    console.log('http expectation');
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse();
    res.status = status;
    res.timestamp = new Date().toISOString();
    // if (process.env.NODE_ENV === 'development') res.message = exception.stack;
    console.log(exception);
    response.status(status).json(res);
  }
}
