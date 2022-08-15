import { PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { Catch, ExceptionFilterMethods } from "@tsed/platform-exceptions";

import { BaseApiError } from "../../errors/base.error";

@Catch(Exception)
export class ApiExceptionFilter implements ExceptionFilterMethods {
  catch(error: BaseApiError, ctx: PlatformContext) {
    const { response } = ctx;

    const { message, status, code } = error;

    response.status(status).body({
      message,
      code
    });
  }
}
