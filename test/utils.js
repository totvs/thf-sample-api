'use strict'

require('should')

module.exports = {
  validateResponse
}

function validateResponse (res, status, dataIsObject = true) {
  res.statusCode.should.be.equal(status)

  res.body.should.is.a.Object()

  if (dataIsObject) {
    res.body.should.have.property('data').is.a.Object()
  } else {
    res.body.should.have.property('data').is.a.Array()
  }

  res.body.should.have.property('length').is.a.Number()
  res.body.should.have.property('messages').is.a.Array()
}
