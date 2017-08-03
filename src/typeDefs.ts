import * as requireAll from 'require-all'
import * as flow from 'lodash/fp/flow'
import * as mapValuesFp from 'lodash/fp/mapValues'
import * as map from 'lodash/fp/map'
import * as values from 'lodash/fp/values'
import * as filter from 'lodash/fp/filter'
import * as compact from 'lodash/fp/compact'
import * as join from 'lodash/fp/join'
import mapValues = require('lodash/mapValues')

export default function (schemasDir) {
  const getSchema = (pSchemas, field) => flow(
    mapValuesFp(field),
    values,
    filter((res) => res !== '\n'),
    compact,
    join('')
  )(pSchemas)

  const buildGraphqlDefTypes = flow(
    map((type) => {
      const combinedType = getSchema(typeDefs, type)
      if (type === 'Schema') {
        return combinedType
      } else if (combinedType) {
        return `type ${type} { ${combinedType} }`
      }
    }),
    compact
  )

  let typeDefs = requireAll(schemasDir)
  typeDefs = mapValues(typeDefs, (schema) => {
    return schema.default || schema
  })

  return buildGraphqlDefTypes([
    'Query',
    'Mutation',
    'Subscription',
    'Schema'
  ])
}
