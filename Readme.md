[![NPM](https://nodei.co/npm/cls-session.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cls-session/)

![CLS Session Test](https://github.com/shfshanyue/cls-session/workflows/CLS%20Session%20Test/badge.svg)

# A cls session implementation using async_hooks

Continuation Local Storage works like thread-local storage in threaded programming. This is a implementation of CLS using async_hooks instead of async-listener.

It need running nodejs version >= 8.2.1.

## Usage

``` js
const Session = require('./index')

const session = new Session()

function timeout (id) {
  session.scope(() => {
    session.set('a', id)
    setTimeout(() => {
      const a = session.get('a')
      console.log(a)
    })
  })
}

timeout(1)
timeout(2)
timeout(3)

// Output:
// 1
// 2
// 3
```

## session middleware in koa

``` js
const app = new Koa()
const session = new Session()

app.use(session.middleware())

app.use(async (ctx, next) => {
  session.set('userId', random())
  await next()
})

app.use((ctx) => {
  const userId = session.get('userId')
  ctx.body = userId
})

app.listen(3200)
```

## API: Class: Session

### session.size: number

### session.scope(callback: () => Promise<any> | any): Promise<any>

### session.set(key: any, value: any)

### session.get(key: any): any

### session.context: Map

