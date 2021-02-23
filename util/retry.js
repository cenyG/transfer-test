const delay = require('./delay')

async function retryIncremental(func, countDown = 100, initialCountDown = countDown) {
  try {
    return await func()
  } catch (err) {
    if (countDown === 0) throw err

    await delay((initialCountDown - countDown) * 100)
    return await retryIncremental(func, countDown - 1, initialCountDown)
  }
}


module.exports = retryIncremental