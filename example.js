const Session = require('./index')

const session = new Session()

function timeout (id) {
  session.scope(() => {
    session.set('a', id)
    setTimeout(() => {
      const a = session.get('a')
      console.log(a)
      console.log('size', session.context.size, '\n\n')
    })
  })
}

timeout(1)
