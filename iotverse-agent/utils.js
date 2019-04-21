'use strict'

function parsePayload (payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8')
  }

  try {
    payload = payload.split("'").join('"')
    payload = JSON.parse(payload)
  } catch (e) {
    payload = null
  }

  return payload
}

module.exports = {
  parsePayload
}
