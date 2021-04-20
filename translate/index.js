const emoji = require('node-emoji')
const redis = require('redis');
const md5 = require('md5');

const util = require('util');

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

class TranslateClient {
  translateClient = null;
  redisClient = null;

  constructor(projectId, redisHost, redisPort) {
    this.translateClient = new Translate({ projectId })
    this.redisClient = redis.createClient(redisPort, redisHost);
    
    // promisify
    this.redisClient.get = util.promisify(this.redisClient.get);
    
    this.redisClient.on('error', err => console.error('ERR:REDIS:', err));
  }

  getLanguages() {
    return  this.translateClient.getLanguages()
  }

  async translate_text(text,target) {
    // hash the text to get the key
    let hash = md5(text+target)

    // check the cache to see if the text exists
    // if so return it
    let translation = await this.redisClient.get(hash)
    if (translation != "" && translation != null) {
      let data = this.base64Decode(translation)
      console.log(`return cached data: ${data}`)
      return {text: data, cached: true}
    }

    try {
      // first translate into english so we can replace any words with emoji
      translation = await this.translateClient.translate(text, 'en')
    } catch(e) {
      console.log(e) 
    }

    if (!translation || translation.length < 1) {
      console.log('unable to translate text to english')
      throw new Error('error translating text')
    }

    console.log(`translation to english: ${translation[0]}`)
    const emojiText = this.addEmojiToText(translation[0])

    try {
      // now translate into the destination language
      translation = await this.translateClient.translate(emojiText, target)
    } catch(e) {
      console.log(e) 
    }

    if (!translation || translation.length < 1) {
      console.log('unable to translate text to destination')
      throw new Error('error translating text')
    }

    // set the translation in the cache
    console.log('setting text in cache')
    let base64Text = this.base64Encode(translation[0])
    this.redisClient.set(hash, base64Text)

    return {text: translation[0], cached: false}
  }

  addEmojiToText (text) {
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

  base64Encode(text) {
    return Buffer.from(text).toString('base64')
  }
  
  base64Decode(text) {
    return Buffer.from(text, 'base64').toString('ascii')
  }
}

module.exports.TranslateClient = TranslateClient;