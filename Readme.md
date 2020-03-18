# A cls session implementation using async_hooks

Continuation Local Storage works like thread-local storage in threaded programming. This is a implementation of CLS using async_hooks instead of async-listener.

It need running nodejs version >= 8.2.1.

## Example

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

## Class: Session

### session.scope(callback)

### session.set(key, value)

### session.get(key)

### session.context

