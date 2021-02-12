const emoji = require('node-emoji')

const health = function (req, res) {
  console.log('handle health request', emoji.get('heart'))

  res.send(emoji.get('heart'))
}

module.exports = health
