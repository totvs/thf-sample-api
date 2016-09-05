'use strict'

require('should')

let request = require('./')
let faker = require('faker/locale/pt_BR')
let utils = require('./utils')
let models = require('../models')

let urlBase = '/api/v1/profiles'

let profile = new Profile((new Date()).valueOf())

describe('Profiles', () => {
  before(() => {
    models.Profile.destroy({where: {}}).then(() => {
      models.Profile.create(profile).then(newProfile => {
        profile = newProfile.get({plain: true})
      })
    })
  })

  describe('GET', () => {
    xit(`${urlBase} - deve retornar uma lista de profiles (status 200)`, done => {
      request.get(urlBase)
        .end((erro, res) => {
          utils.validateResponse(res, 200, false)

          done()
        })
    })

    xit(`${urlBase}/${profile.id} - deve retornar a informação de um único arquivo quando passa um id existente (status 200)`, done => {
      request.get(`${urlBase}/${profile.id}`)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(profile.id)
          res.body.data.originalName.should.be.equal(profile.originalName)
          res.body.data.fileName.should.be.equal(profile.fileName)
          res.body.data.size.should.be.equal(profile.size)

          done()
        })
    })

    xit(`${urlBase}/9999999999999 - não deve retornar nenhum arquivo quando passa um id inexistente (status 404)`, done => {
      request.get(`${urlBase}/9999999999999`)
        .end((erro, res) => {
          utils.validateResponse(res, 404)

          res.body.should.have.property('length').is.a.Number().be.equal(0)

          done()
        })
    })
  })

  describe('POST', () => {
    it(`${urlBase} - deve incluir ou atualizar um profile (status 201)`, done => {
      let postProfile = new Profile()

      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .send(postProfile)
        .end((erro, res) => {
          utils.validateResponse(res, 201)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.should.have.property('id').is.a.Number()
          res.body.data.pageId.should.be.equal(postProfile.pageId)
          res.body.data.userCode.should.be.equal(postProfile.userCode)
          res.body.data.dataCode.should.be.equal(postProfile.dataCode)
          res.body.data.dataValue.should.be.equal(postProfile.dataValue)

          done()
        })
    })

    it(`${urlBase} - não deve incluir um profile se não enviar dados (status 422)`, done => {
      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase} - não deve incluir um profile se enviar os dados incorretos (status 422)`, done => {
      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .send({x: 1, y: 'a'})
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase}/9999999999999 - não deve permitir posts com id (status 405)`, done => {
      request
        .post(`${urlBase}/9999999999999`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(405, done)
    })
  })
})

function Profile (id) {
  if (id) {
    this.id = id
  }

  this.pageId = faker.internet.userName()
  this.userCode = this.pageId
  this.dataCode = faker.system.fileType()
  this.dataValue = faker.lorem.paragraph()
}
