const emoji = require('node-emoji')

const translate = function (langs, translateClient) {
  return wrapAsync(async (req, res, next) => {
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
      const message = `invalid language: ${target}`
      console.log(message)

      res.status(402).send(message)
      return
    }

    // first translate into english so we can replace any words with emoji
    let translation = await translateClient.translate(text, 'en')

    if (!translation || translation.length < 1) {
      console.log('unable to translate text')
      res.status(500).send('error translating text')
      return
    }

    console.log(`translation: ${translation[0]}`)
    const emojiText = addEmojiToText(translation[0])

    // now translate into the destination language
    translation = await translateClient.translate(emojiText, target)
    if (!translation || translation.length < 1) {
      console.log('unable to translate text')
      res.status(500).send('error translating text')
      return
    }

    console.log(`translation: ${translation[0]}`)
    res.send(translation[0])
  })
}

function addEmojiToText (text) {
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

// wrapper for handler to ensure any uncaught errors are caught
function wrapAsync (fn) {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next)
  }
}

module.exports = translate
