import { Module } from 'magnet-core/module'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlKoa } from 'apollo-server-koa'
import { formatErrorGenerator } from 'graphql-apollo-errors'
import * as path from 'path'
import omit = require('lodash/omit')

import resolvers from './resolvers'
import requireTypeDefs from './typeDefs'

export default class MagnetGraphqlServerKoa extends Module {
  init () {
    this.moduleName = 'apollo-server'
    this.defaultConfig = __dirname
  }

  async setup () {
    const formatError = formatErrorGenerator(this.config.error)

    const typeDefs = requireTypeDefs(path.join(this.app.config.baseDirPath, this.config.schemasDir))
    if (!typeDefs.length) {
      this.log.error('No schema definition')
      return
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: Object.assign(
        omit(
          require(path.join(this.app.config.baseDirPath, this.config.scalarFile)).default,
          'Schema'
        ),
        resolvers(this.config.resolversDir, this.app)
      )
    })

    this.insert(graphqlKoa(async (ctx) => ({
      formatError,
      schema,
      context: { state: ctx.state }
    })), 'graphqlServerKoa')
  }
}
