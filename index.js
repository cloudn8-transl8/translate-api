const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const emoji = require('node-emoji')

const projectId = process.env.GOOGLE_PROJECT

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2

// Instantiates a client
const translate = new Translate({ projectId })

const addEmojiToText = function (text) {
  const words = text.split(' ')
  const returnString = []

  words.forEach((w) => {
    const e = emoji.find(w.toLowerCase())
    if (e === undefined || e === null) {
      returnString.push(w)
    } else {
      returnString.push(e.emoji)
    }
  })

  return emoji.emojify(returnString.join(' '))
}

let langs = []

const fetchLanguages = async function () {
  // Lists available translation language with their names in English (the default).
  const [languages] = await translate.getLanguages()
  console.log('Loaded languages:', languages)

  langs = languages
}

// fetch the languages
fetchLanguages()

const app = express()
app.use(bodyParser.text())

// respond with "hello world" when a GET request is made to the homepage
app.post('/translate/:lang', function (req, res) {
  // The text to translate
  const text = req.body

  // The target language
  const target = req.params.lang

  console.log(`handle translate request lang: ${target} text: ${text}`)

  // validate the language
  const ok = langs.some(l => {
    return (l.code === target)
  })

  if (!ok) {
    console.log(ok)
    const message = `Invalid language: ${target}`
    console.log(message)

    res.status(402).send(message)
    return
  }

  // first translate into english
  const translation = translate.translate(text, 'en')
  translation.then((d) => {
    console.log(`Translation: ${d[0]}`)
    const emojiText = addEmojiToText(text)

    // now translate into russian
    const translation = translate.translate(emojiText, target)
    translation.then((d) => {
      console.log(`Translation: ${d[0]}`)
      res.send(d[0])
    }).catch((e) => {
      console.log(`Error: ${e}`)
      res.status(500).send(e)
    })
  }).catch((e) => {
    console.log(`Error: ${e}`)
    res.status(500).send(e)
  })
})

app.get('/health', function (req, res) {
  console.log('handle health request', emoji.get('heart'))

  res.send(emoji.get('heart'))
})

app.get('/languages', function (req, res) {
  console.log('handle languages')

  res.send(langs)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
