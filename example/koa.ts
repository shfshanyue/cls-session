import Session from '../index'
import Koa from 'koa'

const app = new Koa()
const session = new Session()

function random () {
  return Math.random().toString().slice(2, 8)
}

app.use(async (ctx, next) => {
  await session.scope(async () => {
    session.set('userId', random())
    await next()
  })
})

app.use((ctx) => {
  const userId = session.get('userId')
  ctx.body = userId
})

app.listen(3200, () => {
  console.log('Listen 3200')
})
