import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  // To avoid confusion between internal exceptions and NestJS exceptions
  ConflictException as NestConflictException,
  NotFoundException as NestNotFoundException,
  BadRequestException as NestBadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ExceptionBase,
  ConflictException,
  NotFoundException,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '@libs/exceptions';

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof NotFoundException) {
          throw new NestNotFoundException(err.message);
        }
        if (err instanceof ConflictException) {
          throw new NestConflictException(err.message);
        }
        if (err instanceof ArgumentNotProvidedException) {
          throw new NestBadRequestException(err.message);
        }
        if (err instanceof ArgumentInvalidException) {
          throw new NestBadRequestException(err.message);
        }
        return throwError(err);
      }),
    );
  }
}
