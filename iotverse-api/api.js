'use strict'

const debug = require('debug')('iotverse:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
const auth = require('express-jwt')
const guard = require('express-jwt-permissions')()
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

api.get('/agents', auth(config.auth), async (req, rep, next) => {
  debug('A request has come to /agents')

  const { user } = req

  if (!user || !user.username) {
    return next(new Error('Not Authorized'))
  }

  let agents = []

  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findByUsername(user.username)
    }
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

api.get('/metrics/:uuid', auth(config.auth), guard.check(['metrics:read']), async (req, rep, next) => {
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

api.get('/metrics/:uuid/:type', auth(config.auth), guard.check(['metrics:read']), async (req, rep, next) => {
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
