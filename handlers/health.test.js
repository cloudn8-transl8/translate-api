const { mockRequest, mockResponse } = require('./mocks')

const emoji = require('node-emoji')
const healthHandler = require('./health')


test('handler returns a heart when called', () => {
  const req = mockRequest()
  const res = mockResponse()

  healthHandler(req, res)

  expect(res.send).toHaveBeenCalledWith(emoji.get('heart'))
})
