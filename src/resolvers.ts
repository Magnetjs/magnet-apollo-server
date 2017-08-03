import * as requireAll from 'require-all'
import * as path from 'path'
import * as flow from 'lodash/fp/flow'
import * as map from 'lodash/fp/map'
import * as mapValues from 'lodash/fp/mapValues'
import * as values from 'lodash/fp/values'
import * as compact from 'lodash/fp/compact'
import isEmpty = require('lodash/isEmpty')

export default function (resolversDir, app) {
  const getMainFunction = (pSchemas, field) => flow(
    mapValues(field),
    values,
    compact
  )(pSchemas)

  const getResolver = (pSchemas, field) => flow(
    map((resolver) => resolver(app)),
    map(field),
    values,
    compact
  )(pSchemas)

  const domains = requireAll(path.join(app.config.baseDirPath, resolversDir))
  const defaults = getMainFunction(domains, 'default')

  const resolveFunctions = {}
  for (const property of ['Mutation', 'Query', 'Subscription']) {
    const resolvers = Object.assign({}, ...getResolver(defaults, property))
    if (!isEmpty(resolvers)) {
      resolveFunctions[property] = resolvers
    }
  }

  return Object.assign(
    resolveFunctions,
    ...getResolver(defaults, 'Root')
  )
}
