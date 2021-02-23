const Account = require('../../models/Account')

const accounts = [{
  name: 'admin',
  amount: 1000,
  password: '123',
}, {
  name: 'Kolya',
  amount: 500,
  password: '123',
}, {
  name: 'Bob',
  amount: 100,
  password: '123',
}]

Promise.resolve().then(async () => {
  for (let account of accounts) {
    const { name, password, amount } = account
    await Account.create(name, password, amount)
  }

  console.log('seeds executed')
})

