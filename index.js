const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')
const jwtMiddleware = require('koa-jwt')
const logger = require('koa-logger')

const config = require('./config')

const account = require('./routes/account')
const auth = require('./routes/auth')

function createApp() {
  const app = new Koa()
  app.use(logger())
  app.use(koaBody())

  const router = new Router({ prefix: '/api' })
  router.use('/auth', auth.routes())
  router.use(
    jwtMiddleware({
      secret: config.secret,
    })
  )
  router.use('/account', account.routes())

  app.use(router.allowedMethods())
  app.use(router.routes())

  return app
}


createApp().listen(config.port, () => {
  console.log(`app started on port ${config.port}`)
})