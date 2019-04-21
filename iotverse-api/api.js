'use strict'

const debug = require('debug')('iotverse:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
// const auth = require('express-jwt')
// const guard = require('express-jwt-permissions')()
const db = require('iotverse-db/index.')

const config = require('./config')

const api = asyncify(express.Router())

let services, Agent, metrics

api.use('*', async (res, rep, next) => {
  if (!services) {
    try {
      debug('Connecting to database')
      services = await db(config.db)
    } catch (err) {
      return next(err)
    }
    Agent = services.Agent
    metrics = services.Metric
  }
  next()
})

api.get('/agents', (req, rep) => {
  debug('A request has come to /agents')
  rep.send({})
})

api.get('/agent/:uuid', (req, rep, next) => {
  const { uuid } = req.params

  if (uuid !== 'yyy') {
    return next(new Error('Agent not found'))
  }

  rep.send({ uuid })
})

api.get('/metrics/:uuid', (req, rep) => {
  const { uuid } = req.params
  rep.send({ uuid })
})

api.get('/metrics/:uuid/:type', (req, rep) => {
  const { uuid, type } = req.params
  rep.send({ uuid, type })
})

module.exports = api
