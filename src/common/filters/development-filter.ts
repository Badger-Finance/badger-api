import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { Context } from "@tsed/platform-params";

import { PRODUCTION } from "../../config/constants";
import { AccessDeniedDevError } from "../../errors/access/access.denied.dev.error";

@Middleware()
export default class DevelopmentFilter implements MiddlewareMethods {
  use(@Context() _: Context) {
    if (PRODUCTION) throw new AccessDeniedDevError();
  }
}
