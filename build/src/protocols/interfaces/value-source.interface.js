"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValueSource = void 0;
function createValueSource(name, apr, boost) {
    const evaluatedBoost = boost !== null && boost !== void 0 ? boost : { min: 1, max: 1 };
    const isBoostable = evaluatedBoost.min != evaluatedBoost.max;
    return {
        name,
        apr,
        boostable: isBoostable,
        minApr: apr * evaluatedBoost.min,
        maxApr: apr * evaluatedBoost.max,
    };
}
exports.createValueSource = createValueSource;
//# sourceMappingURL=value-source.interface.js.map