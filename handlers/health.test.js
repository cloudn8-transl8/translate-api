const emoji = require('node-emoji')

const healthHandler = require('./health')

const mockRequest = (sessionData, body) => ({
  session: { data: sessionData },
  body
})

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)

  return res
}

test('handler returns a heart when called', () => {
  const req = mockRequest()
  const res = mockResponse()

  healthHandler(req, res)

  expect(res.send).toHaveBeenCalledWith(emoji.get('heart'))
})
