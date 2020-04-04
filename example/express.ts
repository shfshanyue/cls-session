import Session from '../index'
import express from 'express'

const app = express()
const session = new Session()

function random () {
  return Math.random().toString().slice(2, 8)
}

app.use(session.expressMiddleware())

app.use((req, res, next) => {
  session.set('userId', random())
  next()
})

app.use((req, res, next) => {
  const userId = session.get('userId')
  res.send(userId)
})

app.listen(3200, () => {
  console.log('Listen 3200')
})

setInterval(() => {
  console.log('size', session.size)
}, 3000)
