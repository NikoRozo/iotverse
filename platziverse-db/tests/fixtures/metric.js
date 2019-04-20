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

module.exports = {
  single: metric,
  all: metrics,
  byType: type => metrics.filter(a => a.type === type).shift(),
  byId: id => metrics.filter(a => a.id === id).shift()
}
