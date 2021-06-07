import { Injectable, ParamMetadata, PipeMethods } from '@tsed/common';
import { UnprocessableEntity } from '@tsed/exceptions';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeMethods {
  async transform<T = unknown>(value: T, { type: metatype }: ParamMetadata): Promise<T> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object as Record<string, unknown>);

    if (errors.length > 0) {
      const errorConstraints = [];
      for (const error of errors) {
        const { constraints } = error;
        if (constraints) {
          const keys = Object.keys(constraints);
          if (keys.length > 0) {
            errorConstraints.push({
              field: error.property,
              code: constraints[keys[0]],
            });
          }
        }
      }

      throw new UnprocessableEntity('Validation failed', {
        errors: errorConstraints,
      });
    }

    return value;
  }

  private toValidate(metatype: ObjectConstructor): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
