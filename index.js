const fs = require('fs')
const async_hooks = require('async_hooks')

function log (...args) {
  true && fs.writeSync(1, args.join(' ') + '\n')
}

const context = new Map()

async_hooks.createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    log('Init: ', `${type}(asyncId=${asyncId}, parentAsyncId: ${triggerAsyncId})`)
    if (context.has(triggerAsyncId)) {
      context.set(asyncId, context.get(triggerAsyncId))
    }
  },
  before (asyncId) {
    log('Before: ', asyncId)
  },
  after (asyncId) {
    log('After: ', asyncId)
    context.delete(asyncId)
  },
  destroy (asyncId) {
    log('Destory: ', asyncId);
    context.delete(asyncId)
  }
}).enable()


class Session {
  constructor () {
    // cls by asyncId
    this.context = context
  }

  get (key) {
    const asyncId = async_hooks.executionAsyncId()
    const store = this.context.get(asyncId)
    if (store) {
      return store.get(key)
    }
  }

  set (key, value) {
    const asyncId = async_hooks.executionAsyncId()
    const store = this.context.get(asyncId)
    if (store) {
      store.set(key, value)
    }
  }

  async scope (fn) {
    await Promise.resolve()
    const asyncId = async_hooks.executionAsyncId()
    log('\nScope:', asyncId)
    this.context.set(asyncId, new Map())
    const value = await fn()
    log('\nFinish: ', asyncId)
    return value
  }
}

module.exports = Session

