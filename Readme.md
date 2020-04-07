[![NPM](https://nodei.co/npm/cls-session.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cls-session/)

# cls-session

[![npm version](https://img.shields.io/npm/v/cls-session.svg?style=flat-square)](https://www.npmjs.org/package/cls-session)
![build status](https://img.shields.io/github/workflow/status/shfshanyue/cls-session/CLS%20Session%20Test?style=flat-square)
[![install size](https://packagephobia.now.sh/badge?p=cls-session)](https://packagephobia.now.sh/result?p=cls-session)
[![npm downloads](https://img.shields.io/npm/dw/cls-session.svg?style=flat-square)](http://npm-stat.com/charts.html?package=cls-session)

Continuation Local Storage works like thread-local storage in threaded programming. This is a implementation of CLS using async_hooks instead of async-listener.

## Installation

It requires node v8.2.1 or higher for ES2015 and async_hooks support.

``` bash
$ npm install cls-session
```

## Usage

``` js
const Session = require('cls-session')

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

## Middleware in koa

``` js
import Session from 'cls-session'
import Koa from 'koa'

const app = new Koa()
const session = new Session()

app.use(session.middleware())

app.use(async (ctx, next) => {
  session.set('userId', 10086)
  await next()
})

app.use((ctx) => {
  const userId = session.get('userId')
  ctx.body = userId
})

app.listen(3200)
```

## Middleware in express

``` js
import Session from 'cls-session'
import express from 'express'

const app = express()
const session = new Session()

app.use(session.expressMiddleware())

app.use((req, res, next) => {
  session.set('userId', 10086)
  next()
})

app.use((req, res, next) => {
  const userId = session.get('userId')
  res.send(userId)
})

app.listen(3200, () => {
  console.log('Listen 3200')
})
```

## API

### session.scope(callback: () => Promise<any> | any): Promise<any>

Create a new context on which values can be set or read.Run all the functions that are called (either directly, or indirectly through asynchronous functions that take callbacks themselves) from the provided callback within the scope.

### session.set(key: any, value: any)

Set a value on the current continuation context.

### session.get(key: any): any

Get a value on the current continuation context.

### session.middleware()

A middleware of koa.

### session.expressMiddleware()

A middleware of express.

### session.context: Map

### session.size: number

