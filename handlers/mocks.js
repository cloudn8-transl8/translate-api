module.exports.mockRequest = (sessionData, body, params) => ({
  session: { data: sessionData },
  body,
  params
})

module.exports.mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)

  return res
}

module.exports.mockLangs = [
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian' }
]

module.exports.mockTranslateClient = () => {
  const client = {}
  client.translate_text = jest.fn()

  return client
}
