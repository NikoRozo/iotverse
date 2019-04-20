'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const metricFixtures = require('./fixtures/metric')
const agentFixtures = require('./fixtures/agent')

let config = {
    logging() { }
}

let AgentStub = {
    hasMany: sinon.spy()
}

let MetricStub = {
    belongsTo: sinon.spy()
}

let id = 1
let uuid = 'yyy-yyy-yyy'
let type = 'memory'
let db = null
let sandbox = null

let single = Object.assign({}, metricFixtures.single)

let typeUuidArgs2 = {
    where: {
        uuid,
        type
    }
}

let uuidArgs = {
    where: {
        uuid
    }
}

let newMetric = {
    id: 1,
    type: 'ram',
    value: '50',
    agentId: 'yyy-yyy-yyy'
}

test.beforeEach(async () => {
    sandbox = sinon.createSandbox()

    // Model findOne Stub
    AgentStub.findOne = sandbox.stub()
    AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

    // Model create Stub
    MetricStub.create = sandbox.stub()
    MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
        toJSON() { return newMetric }
    }))
    //uuidArgs.include[0].model = MetricStub
    typeUuidArgs.incluede[0].model = MetricStub

    // Model findAll Stub
    MetricStub.findAll = sandbox.stub()
    MetricStub.findAll.withArgs().returns(Promise.resolve(metricFixtures.all))
    //MetricStub.findAll.withArgs(uuidArgs).returns(Promise.resolve(metricFixtures.byAgentUuid(uuid)))
    //MetricStub.findAll.withArgs(typeUuidArgs2).returns(Promise.resolve(metricFixtures.byTypeAgentUuid(uuid, type)))

    // Model findByTypeAgentUuid Stub
    //MetricStub.findByTypeAgentUuid = sandbox.stub()
    //MetricStub.findByTypeAgentUuid.withArgs(typeUuidArgs).returns(Promise.resolve(metricFixtures.findByTypeAgentUuid(uuid, type)))

    const setupDatabase = proxyquire('../index.', {
        './models/agent': () => AgentStub,
        './models/metric': () => MetricStub
    })

    db = await setupDatabase(config)
})

test.afterEach(() => {
    sandbox && sandbox.restore()
})

test('Metric', t => {
    t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('Metric#Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Metric#create', async t => {
    let metric = await db.Metric.create(uuid, newMetric)

    t.true(AgentStub.findOne.called, 'findOne should be called on model')
    t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
    t.true(AgentStub.findOne.calledWith({
        where: { uuid }
    }), 'findOne should be called with uuid args')
    t.true(MetricStub.create.called, 'create should be called on model')
    t.true(MetricStub.create.calledOnce, 'create should be called once')
    t.true(MetricStub.create.calledWith(newMetric), 'create should be called with specified args')

    t.deepEqual(metric, newMetric, 'Metric should be the same')
})

/* test.serial('Metric#findByTypeAgentUuid', async t => {
    let metric = await db.Metric.findByTypeAgentUuid(uuid, type)

    t.true(AgentStub.findAll.called, 'findAll should be called on model')
    t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
    t.true(AgentStub.findAll.calledWith(), 'findAll should be called without args')
  
    t.is(agents.length, agentFixtures.all.length, 'agents should be the same amount')
     
    console.log('metric');
    console.log(metric);
    console.log('fixture');
    console.log(metricFixtures.byTypeAgentUuid(uuid, type));
    t.deepEqual(metric, metricFixtures.byTypeAgentUuid(uuid, type), 'Metric should be the same')
}) */