import { ExceptionFilterMethods, PlatformContext } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
export declare class TsedExceptionFilter implements ExceptionFilterMethods {
  catch(error: Exception, ctx: PlatformContext): void;
}
