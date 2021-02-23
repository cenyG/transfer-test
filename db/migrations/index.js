const fs = require('fs')
const db = require('../index')


const files = fs.readdirSync(__dirname)
.filter(f => f.endsWith('.sql'))
.sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]))

Promise.resolve().then(async () => {

  for (let file of files) {
    const content = fs.readFileSync(`${__dirname}/${file}`, 'utf8')
    await db.query(content)
    console.log(`migrate ${file}`)
  }
  console.log('migrations executed')
})