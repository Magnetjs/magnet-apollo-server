"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("magnet-core/module");
const graphql_tools_1 = require("graphql-tools");
const apollo_server_koa_1 = require("apollo-server-koa");
const graphql_apollo_errors_1 = require("graphql-apollo-errors");
const path = require("path");
const omit = require("lodash/omit");
const resolvers_1 = require("./resolvers");
const typeDefs_1 = require("./typeDefs");
class MagnetGraphqlServerKoa extends module_1.Module {
    init() {
        this.moduleName = 'apollo-server';
        this.defaultConfig = __dirname;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const formatError = graphql_apollo_errors_1.formatErrorGenerator(this.config.error);
            const typeDefs = typeDefs_1.default(path.join(this.app.config.baseDirPath, this.config.schemasDir));
            if (!typeDefs.length) {
                this.log.error('No schema definition');
                return;
            }
            const schema = graphql_tools_1.makeExecutableSchema(Object.assign({ typeDefs, resolvers: Object.assign(omit(require(path.join(this.app.config.baseDirPath, this.config.scalarFile)).default, 'Schema'), resolvers_1.default(this.config.resolversDir, this.app)) }, this.config));
            this.insert(apollo_server_koa_1.graphqlKoa((ctx) => __awaiter(this, void 0, void 0, function* () {
                return (Object.assign({ formatError,
                    schema, context: { state: ctx.state } }, this.config));
            })), 'graphqlServerKoa');
        });
    }
}
exports.default = MagnetGraphqlServerKoa;
//# sourceMappingURL=koa.js.map