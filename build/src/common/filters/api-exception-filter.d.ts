import { ExceptionFilterMethods, PlatformContext } from "@tsed/common";
import { BaseApiError } from "../../errors/base.error";
export declare class ApiExceptionFilter implements ExceptionFilterMethods {
  catch(error: BaseApiError, ctx: PlatformContext): void;
}
