'use strict'

const debug = require('debug')('iotverse:api')
const chalk = require('chalk')
const http = require('http')
const express = require('express')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

server.listen(port, () => {
    console.log(`${chalk.green('[iotverse-api]')} server Listening on Port ${port}`)
})

function handleFatalError (err) {
    console.error(`${chalk.red('[fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
  }

module.exports = server