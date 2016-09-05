'use strict'

require('should')

let request = require('./')
let utils = require('./utils')

let urlBase = '/api/v1/mashups'

describe('Mashups', () => {
  describe('GET', () => {
    it(`${urlBase}/suframaGetCaptcha - deve testar o serviço do Suframa (status 200/503)`, done => {
      request.get(`${urlBase}/suframaGetCaptcha`)
        .end((erro, res) => {
          if (res.statusCode === 200) {
            utils.validateResponse(res, 200)

            res.body.should.have.property('length').is.a.Number().be.equal(1)

            res.body.data.should.have.property('Captcha')
            res.body.data.should.have.property('ServiceExecutionId')
          } else {
            utils.validateResponse(res, 503)

            res.body.should.have.property('length').is.a.Number().be.equal(0)
          }

          done()
        })
    })

    it(`${urlBase}/getConsultaCPFCaptcha - deve testar o serviço de consulta de CPF (status 200/503)`, done => {
      request.get(`${urlBase}/getConsultaCPFCaptcha`)
        .end((erro, res) => {
          if (res.statusCode === 200) {
            utils.validateResponse(res, 200)

            res.body.should.have.property('length').is.a.Number().be.equal(1)

            res.body.data.should.have.property('Captcha')
            res.body.data.should.have.property('ServiceExecutionId')
          } else {
            utils.validateResponse(res, 503)

            res.body.should.have.property('length').is.a.Number().be.equal(0)
          }

          done()
        })
    })

    it(`${urlBase}/getConsultaCNPJCaptcha - deve testar o serviço de consulta de CNPJ (status 200/503)`, done => {
      request.get(`${urlBase}/getConsultaCNPJCaptcha`)
        .end((erro, res) => {
          if (res.statusCode === 200) {
            utils.validateResponse(res, 200)

            res.body.should.have.property('length').is.a.Number().be.equal(1)

            res.body.data.should.have.property('Captcha')
            res.body.data.should.have.property('ServiceExecutionId')
          } else {
            utils.validateResponse(res, 503)

            res.body.should.have.property('length').is.a.Number().be.equal(0)
          }

          done()
        })
    })

    it(`${urlBase}/sintegraParcial - deve testar o serviço do Sintegra (status 200/503)`, done => {
      request.get(`${urlBase}/sintegraParcial`)
        .end((erro, res) => {
          if (res.statusCode === 200) {
            utils.validateResponse(res, 200)

            res.body.should.have.property('length').is.a.Number().be.equal(1)

            res.body.data.should.have.property('Captcha')
            res.body.data.should.have.property('ServiceExecutionId')
          } else {
            utils.validateResponse(res, 503)

            res.body.should.have.property('length').is.a.Number().be.equal(0)
          }

          done()
        })
    })
  })
})
