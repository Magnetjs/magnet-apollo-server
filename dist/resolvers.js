"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAll = require("require-all");
const path = require("path");
const flow = require("lodash/fp/flow");
const map = require("lodash/fp/map");
const mapValues = require("lodash/fp/mapValues");
const values = require("lodash/fp/values");
const compact = require("lodash/fp/compact");
const isEmpty = require("lodash/isEmpty");
function default_1(resolversDir, app) {
    const getMainFunction = (pSchemas, field) => flow(mapValues(field), values, compact)(pSchemas);
    const getResolver = (pSchemas, field) => flow(map((resolver) => resolver(app)), map(field), values, compact)(pSchemas);
    const domains = requireAll(path.join(app.config.baseDirPath, resolversDir));
    const defaults = getMainFunction(domains, 'default');
    const resolveFunctions = {};
    for (const property of ['Mutation', 'Query', 'Subscription']) {
        const resolvers = Object.assign({}, ...getResolver(defaults, property));
        if (!isEmpty(resolvers)) {
            resolveFunctions[property] = resolvers;
        }
    }
    return Object.assign(resolveFunctions, ...getResolver(defaults, 'Root'));
}
exports.default = default_1;
//# sourceMappingURL=resolvers.js.map