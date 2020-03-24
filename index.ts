import fs from 'fs'
import async_hooks from 'async_hooks'

function log (...args: any[]) {
  process.env.DEBUG_CLS && fs.writeSync(1, args.join(' ') + '\n')
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
  // cls by asyncId
  context = context

  get (key: any) {
    const asyncId = async_hooks.executionAsyncId()
    const store = this.context.get(asyncId)
    if (store) {
      return store.get(key)
    }
  }

  set (key: any, value: any) {
    const asyncId = async_hooks.executionAsyncId()
    const store = this.context.get(asyncId)
    if (store) {
      store.set(key, value)
    }
  }

  async scope (fn: () => Promise<any> | any) {
    await Promise.resolve()
    const asyncId = async_hooks.executionAsyncId()
    log('\nScope:', asyncId)
    this.context.set(asyncId, new Map())
    const value = await fn()
    log('\nFinish: ', asyncId)
    return value
  }
}

export default Session

