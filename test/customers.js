'use strict'

require('should')

let request = require('./')
let faker = require('faker/locale/pt_BR')
let utils = require('./utils')
let models = require('../models')

const urlBase = '/api/v1/customers'

let customer = new Customer((new Date()).valueOf())

describe('Customers', () => {
  before(() => {
    models.Customer.destroy({where: {}}).then(() => {
      models.Customer.create(customer).then(newCustomer => {
        customer = newCustomer.get({plain: true})
      })
    })
  })

  describe('GET', () => {
    it(`${urlBase} - deve retornar uma lista de clientes (status 200)`, done => {
      request.get(urlBase)
        .end((erro, res) => {
          utils.validateResponse(res, 200, false)

          done()
        })
    })

    it(`${urlBase}/${customer.id} - deve retornar um único cliente quando passa um id existente (status 200)`, done => {
      request.get(`${urlBase}/${customer.id}`)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(customer.id)
          res.body.data.name.should.be.equal(customer.name)
          res.body.data.doc_cpf.should.be.equal(customer.doc_cpf)
          res.body.data.doc_rg.should.be.equal(customer.doc_rg)

          done()
        })
    })

    it(`${urlBase}/9999999999999 - não deve retornar nenhum cliente quando passa um id inexistente (status 404)`, done => {
      request.get(`${urlBase}/9999999999999`)
        .end((erro, res) => {
          utils.validateResponse(res, 404)

          res.body.should.have.property('length').is.a.Number().be.equal(0)

          done()
        })
    })
  })

  describe('POST', () => {
    it(`${urlBase} - deve incluir um novo cliente e retornar o novo cliente (status 201)`, done => {
      let postCustomer = new Customer()

      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .send(postCustomer)
        .end((erro, res) => {
          utils.validateResponse(res, 201)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.should.have.property('id').is.a.Number()
          res.body.data.name.should.be.equal(postCustomer.name)
          res.body.data.doc_cpf.should.be.equal(postCustomer.doc_cpf)
          res.body.data.doc_rg.should.be.equal(postCustomer.doc_rg)

          done()
        })
    })

    it(`${urlBase} - não deve incluir um cliente se não enviar dados (status 422)`, done => {
      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase} - não deve incluir um cliente se enviar os dados incorretos (status 422)`, done => {
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

  describe('PUT', () => {
    it(`${urlBase} - não deve permitir put sem id (status 405)`, done => {
      request
        .put(urlBase)
        .set('Accept', 'application/json')
        .expect('Content-type', /utf-8/)
        .expect(405, done)
    })

    it(`${urlBase}/${customer.id} - deve atualizar um cliente e retornar o cliente atualizado (status 200)`, done => {
      customer.name = faker.name.findName()
      customer.doc_cpf = faker.random.number(99999999999).toString()
      customer.doc_rg = faker.random.number(99999999).toString()

      request
        .put(`${urlBase}/${customer.id}`)
        .set('Accept', 'application/json')
        .send(customer)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(customer.id)
          res.body.data.name.should.be.equal(customer.name)
          res.body.data.doc_cpf.should.be.equal(customer.doc_cpf)
          res.body.data.doc_rg.should.be.equal(customer.doc_rg)

          done()
        })
    })

    it(`${urlBase}/${customer.id} - não deve atualizar um cliente se não enviar os dados (status 422)`, done => {
      request
        .put(`${urlBase}/${customer.id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase}/8888888888888 - não deve atualizar nenhum cliente se enviar um id diferente do id dos dados (status 422)`, done => {
      let putCustomer = JSON.parse(JSON.stringify(customer))
      putCustomer.id = 9999999999999

      request
        .put(`${urlBase}/8888888888888`)
        .set('Accept', 'application/json')
        .send(putCustomer)
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase}/9999999999999 - não deve atualizar nenhum cliente se enviar um id inexistente (status 404)`, done => {
      let putCustomer = JSON.parse(JSON.stringify(customer))
      putCustomer.id = 9999999999999

      request
        .put(`${urlBase}/9999999999999`)
        .set('Accept', 'application/json')
        .send(putCustomer)
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(404, done)
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

    it(`${urlBase}/${customer.id} - deve excluir um cliente existente ao passar um id existente (status 204)`, done => {
      request
        .delete(`${urlBase}/${customer.id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(204, done)
    })

    it(`${urlBase}/9999999999999 - não deve excluir nenhum cliente ao passar um id inexistente (status 404)`, done => {
      request
        .delete(urlBase + '/9999999999999')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(404, done)
    })
  })
})

function Customer (id) {
  if (id) {
    this.id = id
  }

  this.name = faker.name.findName()
  this.doc_cpf = faker.random.number(99999999999).toString()
  this.doc_rg = faker.random.number(99999999).toString()
  this.email = faker.internet.email()
  this.phone = faker.phone.phoneNumberFormat().replace(/\D/g, '')
  this.birthday = null
  this.note = null
  this.address_zip = faker.address.zipCode().replace(/\D/g, '')
  this.address_street = faker.address.streetAddress()
  this.address_number = null
  this.address_district = null
  this.address_city = null
  this.address_complement = null
}
