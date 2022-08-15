import { Catch, ExceptionFilterMethods, PlatformContext } from '@tsed/common';
import { isObject, isString } from '@tsed/core';
import { Exception, InternalServerError } from '@tsed/exceptions';

interface ExceptionBody {
  message?: string;
  errors?: unknown[];
}

// Deprecated, plz consider using ApiExceptionFilter
@Catch(Exception)
export class TsedExceptionFilter implements ExceptionFilterMethods {
  catch(error: Exception, ctx: PlatformContext) {
    const { response } = ctx;
    let exception: Exception = new InternalServerError('Internal server error');

    // Unfortunately, TSED HTTP Exceptions do not extend the HTTPException
    // type, so we cannot check `error instanceof HttpException`. This is a
    // bit jank, but if `status` is defined, we use the thrown error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).status) {
      exception = error;
    }

    const { message, status } = exception;
    const body: ExceptionBody = {
      message
    };
    let exceptionResponse = exception.body;

    if (isString(exceptionResponse)) {
      body.message = exceptionResponse;
    } else if (isObject(exceptionResponse)) {
      exceptionResponse = exceptionResponse as Record<string, unknown>;
      if (exceptionResponse.errors) {
        body.errors = exceptionResponse.errors;
      }
    }

    response.status(status).body(body);
  }
}
