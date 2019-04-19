'use strict'

const setupDataBase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDataBase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  // Relaciones entre tablas
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  // Validar si existe coneción a la DB, si hay algun error lo debe controlar quien llama la función
  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }
  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
