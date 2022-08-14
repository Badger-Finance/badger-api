import { Catch, ExceptionFilterMethods, PlatformContext } from "@tsed/common";

import { BaseApiError } from "../../errors/base.error";

@Catch(BaseApiError)
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
