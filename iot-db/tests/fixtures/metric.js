'use strict'

const agentFixtures = require('./agent')

const metric = {
  id: 1,
  type: 'memory',
  value: '300',
  agent: agentFixtures.byUuid('yyy-yyy-yyy'),
  createdAt: new Date(),
  updatedAt: new Date()
}

const metrics = [
  metric,
  extend(metric, { type: 'cpu', value: '200' }),
  extend(metric, { value: '100' }),
  extend(metric, { type: 'cpu' }),
  extend(metric, { type: 'cpu', value: '200', agent: agentFixtures.byUuid('yyy-yyy-yyx') }),
  extend(metric, { value: '100', agent: agentFixtures.byUuid('yyy-yyy-yyx') }),
  extend(metric, { type: 'cpu', agent: agentFixtures.byUuid('yyy-yyy-yyx') })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

function byAgentUuidGroupType (metris) {
  let types = []
  for (let i = 0; i < metris.length; i++) {
    const element = metris[i]
    if (types.filter(a => a.type === element.type).length === 0) {
      types.push({
        type: element.type
      })
    }
  }
  return types
}

module.exports = {
  single: metric,
  all: metrics,
  byAgentUuid: uuid => byAgentUuidGroupType(metrics.filter(a => a.agent.uuid === uuid)),
  byTypeAgentUuid: (uuid, type) => metrics.filter(a => a.agent.uuid === uuid && a.type === type)
}
