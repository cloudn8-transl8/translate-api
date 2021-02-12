const {
  mockRequest,
  mockResponse,
  mockLangs,
  mockTranslateClient
} = require('./mocks')

const healthHandler = require('./translate')

test('handler returns a 402 when given an invalid language', async () => {
  const req = mockRequest(null, null, { lang: 'ru' })
  const res = mockResponse()

  await runHandler(mockLangs, null, req, res)

  expect(res.status).toHaveBeenCalledWith(402)
})

test('handler first translates to english, returns 500 on fail', async () => {
  const body = 'I love coffee'
  const lang = 'tt'

  const req = mockRequest(null, body, { lang: lang })
  const res = mockResponse()
  const client = mockTranslateClient()
  client.translate.mockImplementationOnce(() =>
    Promise.resolve([])
  )

  await runHandler(mockLangs, client, req, res)

  expect(client.translate).toHaveBeenCalledTimes(1)
  expect(client.translate).toHaveBeenCalledWith(body, 'en')
  expect(res.status).toHaveBeenCalledWith(500)
})

test('handler calls translate with emoji text, returns 500 on fail', async () => {
  const body = 'I love coffee'
  const bodyWithEmoji = 'I love ☕'
  const lang = 'tt'

  const req = mockRequest(null, body, { lang: lang })
  const res = mockResponse()
  const client = mockTranslateClient()
  client.translate
    .mockImplementationOnce(() =>
      Promise.resolve(['I love coffee'])
    )
    .mockImplementationOnce(() =>
      Promise.resolve(null)
    )

  await runHandler(mockLangs, client, req, res)

  expect(client.translate).toHaveBeenCalledTimes(2)
  expect(client.translate).toHaveBeenCalledWith(bodyWithEmoji, 'tt')
  expect(res.status).toHaveBeenCalledWith(500)
})

async function runHandler(mockLangs, client, req, res) {
  await healthHandler(mockLangs, client)(req, res)
}

test('handler calls translate with emoji text, returns translation on success', async () => {
  const body = 'I love coffee'
  const bodyWithEmoji = 'I love ☕'
  const bodyResponse = 'I love kafe'
  const lang = 'tt'

  const req = mockRequest(null, body, { lang: lang })
  const res = mockResponse()
  const client = mockTranslateClient()
  client.translate
    .mockImplementationOnce(() =>
      Promise.resolve([body])
    )
    .mockImplementationOnce(() =>
      Promise.resolve([bodyResponse])
    )

  await runHandler(mockLangs, client, req, res)

  expect(client.translate).toHaveBeenCalledTimes(2)
  expect(client.translate).toHaveBeenCalledWith(bodyWithEmoji, 'tt')
  expect(res.send).toHaveBeenCalledWith(bodyResponse)
})
