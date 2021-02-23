const bcrypt = require('bcrypt')

module.exports = {
  createHash: (password) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  },
  compareHash: (password, hash) => {
    return bcrypt.compareSync(password, hash)
  }
}