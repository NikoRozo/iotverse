'use strict'

const debug = require('debug')('iotverse:agent')
const mqtt = require('mqtt')
const defaults = require('defaults')
const uuid = require('uuid')
const EventEmitter = require('events')

const { parsePayload } = require('./utils')

const options = {
    name: 'untitled',
    username: 'platzi',
    interval: 5000,
    mqtt: {
      host: 'mqtt://localhost'
    }
  }

class IoTVerseAgent extends EventEmitter {
  constructor (opts) {
    super()

    this._options = defaults(opts, options)
    this._started = false
    this._timer = null
    this._client = null
    this,_agentId = null
  }

  connect () {
    if (!this._timer) {
      const opts = this._options
      this._client = mqtt.connect(opts.mqtt.host)
      this._started = true

      this._client.subscribe('agent/connected')
      this._client.subscribe('agent/message')
      this._client.subscribe('agent/disconnected')

      this._client.on('connect', () => {
        this._agentId = uuid.v4()
        this.emit('connected', this._agentId)

        this._timer = setInterval(() => {
          this.emit('agent/message', 'this is message')
        }, opts.interval)
      })

      this._client.on('agent/message', (topic, payload) => {
        payload = parsePayload(payload)

        let broadcast = null
        switch (topic) {
            case 'agent/connected':
            case 'agent/message':
            case 'agent/disconnected':
                broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId
                break;
        }

        if (broadcast) {
            this.emit(topic, payload)
        }
      })

      this._client.on('error', () => {
        this.disconnect()
      })

    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconnected')
    }
  }
}

module.exports = IoTVerseAgent
