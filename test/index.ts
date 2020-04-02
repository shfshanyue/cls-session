import { describe, it } from 'mocha'
import { expect } from 'chai'
import request from 'supertest'

import Koa from 'koa'

import Session from '../index'

describe('CLS Session', function () {
  it('expect work', async () => {
    const session = new Session()

    session.scope(() => {
      session.set('test', 10086)
      setTimeout(() => {
        const test = session.get('test')
        expect(test).to.equal(10086)
      })
    })
  })

  it ('expect scope return value', async () => {
    const session = new Session()

    const value = await session.scope(() => {
      return 3
    })
    
    expect(value).to.equal(3)
  })

  it('expect work at async resource', async () => {
    const session = new Session()

    function timeout (id: number) {
      return new Promise(resolve => {
        session.scope(() => {
          session.set('test', id)
          setTimeout(() => {
            const test = session.get('test')
            resolve(test)
          }, 100)
        })
      })
    }

    timeout(1).then(v => expect(v).to.equal(1))
    timeout(2).then(v => expect(v).to.equal(2))
  })

  it ('expect work at koa middleware', (done) => {

    const app = new Koa()
    const session = new Session()

    const hello = 'hello, world'

    app.use(session.middleware())

    app.use(async (ctx, next) => {
      ctx.body = hello
      session.set('userId', 10086)
      await next()
    })

    app.use((ctx) => {
      const userId = session.get('userId')
      expect(userId).to.equal(10086)
      expect(ctx.body).to.equal(hello)
    })

    request(app.callback())
      .get('/')
      .expect(hello, done)
  })
})
