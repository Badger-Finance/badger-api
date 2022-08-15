import { ParamMetadata, PipeMethods } from "@tsed/common";
export declare class ValidationPipe implements PipeMethods {
  transform<T = unknown>(value: T, { type: metatype }: ParamMetadata): Promise<T>;
  private toValidate;
}
