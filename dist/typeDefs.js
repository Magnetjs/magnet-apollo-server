"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAll = require("require-all");
const flow = require("lodash/fp/flow");
const mapValuesFp = require("lodash/fp/mapValues");
const map = require("lodash/fp/map");
const values = require("lodash/fp/values");
const filter = require("lodash/fp/filter");
const compact = require("lodash/fp/compact");
const join = require("lodash/fp/join");
const mapValues = require("lodash/mapValues");
function default_1(schemasDir) {
    const getSchema = (pSchemas, field) => flow(mapValuesFp(field), values, filter((res) => res !== '\n'), compact, join(''))(pSchemas);
    const buildGraphqlDefTypes = flow(map((type) => {
        const combinedType = getSchema(typeDefs, type);
        if (type === 'Schema') {
            return combinedType;
        }
        else if (combinedType) {
            return `type ${type} { ${combinedType} }`;
        }
    }), compact);
    let typeDefs = requireAll(schemasDir);
    typeDefs = mapValues(typeDefs, (schema) => {
        return schema.default || schema;
    });
    return buildGraphqlDefTypes([
        'Query',
        'Mutation',
        'Subscription',
        'Schema'
    ]);
}
exports.default = default_1;
//# sourceMappingURL=typeDefs.js.map