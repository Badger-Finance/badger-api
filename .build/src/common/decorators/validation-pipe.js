"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const exceptions_1 = require("@tsed/exceptions");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let ValidationPipe = class ValidationPipe {
    async transform(value, { type: metatype }) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToClass)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
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
            throw new exceptions_1.UnprocessableEntity('Validation failed', {
                errors: errorConstraints,
            });
        }
        return value;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
};
ValidationPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ValidationPipe);
exports.ValidationPipe = ValidationPipe;
//# sourceMappingURL=validation-pipe.js.map