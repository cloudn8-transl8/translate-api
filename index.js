const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const cors = require('cors')

const { healthHandler, translateHandler } = require('./handlers')
const { TranslateClient } = require('./translate')

const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const projectId = process.env.GOOGLE_PROJECT
const redisHost = process.env.GOOGLE_REDISHOST || 'localhost';
const redisPost = process.env.GOOGLE_REDISPOST || 6379;

const translateClient = new TranslateClient(projectId, redisHost, redisPost)

async function fetchLanguages () {
  // Lists available translation language with their names in English (the default).
  const [languages] = await translateClient.getLanguages()
  console.log('Loaded languages:', languages)

  return languages
}

async function setup() {
  // fetch the languages
  const langs = [];
  const app = express()


  app.use(bodyParser.text())

  app.post('/translate/:lang', cors(corsOptions), translateHandler(langs, translateClient))

  app.get('/health', healthHandler)

  app.get('/languages', cors(corsOptions), function (req, res) {
    console.log('handle languages')

    res.send(langs)
  })

  // error handling function
  app.use(function (error, req, res, next) {
    console.error(error)
    res.status(500).json({ message: error.message })
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

setup()
