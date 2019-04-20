'use strict'

const db = require('../index.')
const chalk = require('chalk')

async function run () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }

  const { Agent, Metric } = await db(config).catch(handleFatalError)

  const agent = await Agent.createOrUpdate({
    uuid: 'YYY',
    name: 'test-test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log('--agent--')
  console.log(agent)

  const agents = await Agent.findAll().catch(handleFatalError)

  console.log('--agents--')
  console.log(agents)

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300'
  }).catch(handleFatalError)

  const metric2 = await Metric.create(agent.uuid, {
    type: 'cpu',
    value: '100'
  }).catch(handleFatalError)

  console.log('--create metrics--')
  console.log(metric)
  console.log(metric2)

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)

  console.log('--metrics--')
  console.log(metrics)

  const metricsType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError)

  console.log('--metrics type--')
  console.log(metricsType)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.massage}`)
  console.error(err.stack)
  process.exit(1)
}

run()
