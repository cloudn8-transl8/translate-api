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

async function runHandler(mockLangs, client, req, res) {
  await healthHandler(mockLangs, client)(req, res)
}
