'use strict'

let request = require('./')

describe('URL inexistente', () => {
  it('deve retornar status 404 e a mensagem "Url inválida"', done => {
    let urlRandom = (new Date()).getTime()

    request.get(`/${urlRandom}`)
      .expect('Content-type', /utf-8/)
      .expect(404, 'Url inválida', done)
  })
})
