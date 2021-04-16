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

    try {
      let translation = await translateClient.translate_text(text, target)
      console.log(`translation from client: ${translation.text}`)

      if(translation.cached) {
        res.status(302).send(translation.text)
      } else {
        res.send(translation.text)
      }
    } catch(e) {
      console.log(`error from translation client ${e}`)
      res.status(500).send(e)
    }
  })
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
