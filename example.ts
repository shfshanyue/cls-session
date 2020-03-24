import Session from './index'

const session = new Session()

function timeout (id: number) {
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
