'use strict'

let should = require('should')

let request = require('./')
let fs = require('fs')
let utils = require('./utils')
let models = require('../models')

let urlBase = '/api/v1/files'

let file = new File((new Date()).valueOf())

describe('Files', () => {
  before(() => {
    models.File.destroy({where: {}}).then(() => {
      models.File.create(file).then(newFile => {
        file = newFile.get({plain: true})
      })
    })
  })

  describe('GET', () => {
    it(`${urlBase} - deve retornar uma lista de arquivos (status 200)`, done => {
      request.get(urlBase)
        .end((erro, res) => {
          utils.validateResponse(res, 200, false)

          done()
        })
    })

    it(`${urlBase}/${file.id} - deve retornar a informação de um único arquivo quando passa um id existente (status 200)`, done => {
      request.get(`${urlBase}/${file.id}`)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(file.id)
          res.body.data.originalName.should.be.equal(file.originalName)
          res.body.data.fileName.should.be.equal(file.fileName)
          res.body.data.size.should.be.equal(file.size)

          done()
        })
    })

    it(`${urlBase}/9999999999999 - não deve retornar nenhum arquivo quando passa um id inexistente (status 404)`, done => {
      request.get(`${urlBase}/9999999999999`)
        .end((erro, res) => {
          utils.validateResponse(res, 404)

          res.body.should.have.property('length').is.a.Number().be.equal(0)

          done()
        })
    })
  })

  describe('POST', () => {
    it(`${urlBase} - deve aceitar o upload de um arquivo (status 201)`, done => {
      request
        .post(urlBase)
        .attach('file', './test/file.png')
        .end((erro, res) => {
          utils.validateResponse(res, 201)

          fs.stat(`./uploads/${res.body.data.fileName}`, (err, stats) => {
            should(err).be.exactly(null)
            stats.isFile().should.be.ok()
            done()
          })
        })
    })
  })

  describe('DELETE', () => {
    it(`${urlBase} - não deve permitir delete sem id (status 405)`, done => {
      request
        .delete(urlBase)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(405, done)
    })

    it(`${urlBase}/${file.id} - deve excluir um arquivo existente ao passar um id existente (status 204)`, done => {
      request
        .delete(`${urlBase}/${file.id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(204, done)
    })

    it(`${urlBase}/9999999999999 - não deve excluir nenhum arquivo ao passar um id inexistente (status 404)`, done => {
      request
        .delete(urlBase + '/999999')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(404, done)
    })
  })
})

function File (id) {
  this.id = (new Date()).valueOf()
  this.originalName = 'file.png'
  this.fileName = '82fba2589d4ee543232b60ec6c22cbe3'
  this.size = 5915
}
