const Router = require('koa-router')
const Account = require('../../models/Account')

const router = new Router()

router.get('/', async ctx => {
  const account = await Account.getById(ctx.state.user.id)
  if (account) {
    ctx.body = account
  }
})

router.get('/:id', async ctx => {
  const account = await Account.getById(ctx.params.id)
  if (account) {
    ctx.body = account
  }
})

router.post('/transfer/:from/:to', async (ctx) => {
  const { from, to } = ctx.request.params
  const { amount } = ctx.request.body

  if (ctx.state.user.id !== parseInt(from)) {
    const error = new Error('try to transfer from wrong account')
    error.status = 403
    throw error
  }

  await Account.transfer(from, to, amount)
  const account = await Account.getById(from)

  ctx.response.status = 200
  ctx.body = account
})

module.exports = router