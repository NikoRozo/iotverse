'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const AgentFixtures = require('./fixtures/agent');

let config = {
  logging: function () { }
}

let MetricStub = {
  belongsTo: sinon.spy()
}

let single = Object.assign({}, AgentFixtures.single)
let id = 1
let AgentStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  const setupDataBase = proxyquire('../index.', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDataBase(config)
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('Setup', t => {
  t.truthy(AgentStub.hasMany.called, 'AgentModel.HhasMeny was executed')
  t.truthy(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be Metric Model')
  t.truthy(MetricStub.belongsTo.called, 'AgentModel.HhasMeny was executed')
  t.truthy(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be Agent Model')
})

test.serial('Agent#findById', async t => {
    let agent = await db.Agent.findById(id)

    t.deepEqual(agent, AgentFixtures.byId(id), 'should be the same')
})