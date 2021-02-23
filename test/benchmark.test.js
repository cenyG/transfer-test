const { describe, it, beforeEach } = require('mocha')
const assert = require('assert')

const Account = require('../models/Account')

const retry = require('../util/retry')


async function benchmark(transferFunc) {
  const promises = []

  for (let i = 0; i < 1000; i++) {
    promises.push(retry(transferFunc.bind(null, 1, 2, 1)))
  }

  for (let i = 0; i < 500; i++) {
    promises.push(retry(transferFunc.bind(null, 2, 3, 1)))
  }

  for (let i = 0; i < 100; i++) {
    promises.push(retry(transferFunc.bind(null, 3, 1, 1)))
  }
  await Promise.all(promises)

  const [acc1, acc2, acc3] = await Promise.all([
    Account.getById(1),
    Account.getById(2),
    Account.getById(3)
  ])

  const actual = [parseInt(acc1.amount), parseInt(acc2.amount), parseInt(acc3.amount)]
  const expected = [100, 1000, 500]

  assert.deepEqual(actual, expected)
}

describe('transfer benchmark', function () {
  this.timeout(5 * 60 * 1000)

  beforeEach(async function() {
    await Account.setById(1, 1000)
    await Account.setById(2, 500)
    await Account.setById(3, 100)
  })

  it('repeatable read', async function () {
    await benchmark(Account.transfer)
  })

  it('just for fun read committed', async function () {
    await benchmark(Account._transferReadCommitted)
  })

  it('just for fun serializable', async function () {
    await benchmark(Account._transferSerializable)
  })

})