function delay(ms = 500) {
  return new Promise(h => setTimeout(h, ms))
}

module.exports = delay