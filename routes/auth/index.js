const Router = require('koa-router')
const jwt = require('jsonwebtoken')

const config = require('../../config')
const Account = require('../../models/Account')
const { compareHash } = require('../../util')


const router = new Router()

async function issueToken(accountId) {
  return jwt.sign({ id: accountId }, config.secret)
}

router.post('/login', async ctx => {
  const { name, password } = ctx.request.body
  const account = await Account.findByName(name)
  if (!account || !compareHash(password, account.password)) {
    const error = new Error('account not exists or wrong password')
    error.status = 403
    throw error
  }
  ctx.body = await issueToken(account.id)
})

router.post('/register', async ctx => {
  const { name, password } = ctx.request.body

  await Account.create(name, password)
  ctx.status = 201
})


module.exports = router