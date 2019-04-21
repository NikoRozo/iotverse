'use strict'

const debug = require('debug')('iotverse:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
// const auth = require('express-jwt')
// const guard = require('express-jwt-permissions')()
const db = require('iotverse-db/index.')

const config = require('./config')

const api = asyncify(express.Router())

let services, Agent, Metric

api.use('*', async (res, rep, next) => {
  if (!services) {
    try {
      debug('Connecting to database')
      services = await db(config.db)
    } catch (err) {
      return next(err)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', async (req, rep, next) => {
  debug('A request has come to /agents')

  let agents = []

  try {
    agents = await Agent.findConnected()
  } catch (e) {
    return next(e)
  }

  rep.send(agents)
})

api.get('/agent/:uuid', async (req, rep, next) => {
  const { uuid } = req.params

  debug(`request to /agents/${uuid}`)

  let agent

  try {
    agent = await Agent.findByUuid(uuid)
  } catch (e) {
    return next(e)
  }

  rep.send(agent)
})

api.get('/metrics/:uuid', async (req, rep, next) => {
  const { uuid } = req.params

  debug(`request to /metrics/${uuid}`)

  let metrics = []

  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    return next(e)
  }

  if (!Metric || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }

  rep.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, rep, next) => {
  const { uuid, type } = req.params
  debug(`request to /metrics/${uuid}/${type}`)

  let metrics = []

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    return next(e)
  }

  if (!Metric || metrics.length === 0) {
    return next(new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`))
  }

  rep.send(metrics)
})

module.exports = api
