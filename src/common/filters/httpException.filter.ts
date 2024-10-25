import { ExceptionFilter, ArgumentsHost } from '@nestjs/common/interfaces';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(`Status: ${status}. Error: ${JSON.stringify(message)}`);

    response.status(status).json({
      time: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
