const express = require('express')
const app = express()
const port = 3000

// respond with "hello world" when a GET request is made to the homepage
app.post('/translate', function (req, res) {
  console.log('handle translate request')

  res.send('hello world')
})

app.get('/health', function (req, res) {
  console.log('handle health request')

  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
