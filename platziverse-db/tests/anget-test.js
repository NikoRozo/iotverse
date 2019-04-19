'use strict'

const test = require('ava')

let config = {
    logging: function () { }
}

let db = null

test.beforeEach(async () => {
  const setupDataBase = require('../index.')
  db = await setupDataBase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})
