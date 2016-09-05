'use strict'

require('should')

let request = require('./')
let faker = require('faker/locale/pt_BR')
let utils = require('./utils')
let models = require('../models')

let urlBase = '/api/v1/heros'

let hero = new Hero((new Date()).valueOf())

describe('Heros', () => {
  before(() => {
    models.Hero.destroy({where: {}}).then(() => {
      models.Hero.create(hero).then(newHero => {
        hero = newHero.get({plain: true})
      })
    })
  })

  describe('GET', () => {
    it(`${urlBase} - deve retornar uma lista de heróis (status 200)`, done => {
      request.get(urlBase)
        .end((erro, res) => {
          utils.validateResponse(res, 200, false)

          done()
        })
    })

    it(`${urlBase}/${hero.id} - deve retornar um único herói quando passa um id existente (status 200)`, done => {
      request.get(`${urlBase}/${hero.id}`)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(hero.id)
          res.body.data.name.should.be.equal(hero.name)
          res.body.data.nickname.should.be.equal(hero.nickname)
          res.body.data.email.should.be.equal(hero.email)
          res.body.data.note.should.be.equal(hero.note)

          done()
        })
    })

    it(`${urlBase}/9999999999999 - não deve retornar nenhum herói quando passa um id inexistente (status 404)`, done => {
      request.get(`${urlBase}/9999999999999`)
        .end((erro, res) => {
          utils.validateResponse(res, 404)

          res.body.should.have.property('length').is.a.Number().be.equal(0)

          done()
        })
    })
  })

  describe('POST', () => {
    it(`${urlBase} - deve incluir um novo herói e retornar o novo herói (status 201)`, done => {
      let postHero = new Hero()

      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .send(postHero)
        .end((erro, res) => {
          utils.validateResponse(res, 201)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.should.have.property('id').is.a.Number()
          res.body.data.name.should.be.equal(postHero.name)
          res.body.data.nickname.should.be.equal(postHero.nickname)
          res.body.data.email.should.be.equal(postHero.email)

          done()
        })
    })

    it(`${urlBase} - não deve incluir um herói se não enviar dados (status 422)`, done => {
      request
        .post(urlBase)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase} - não deve incluir um herói se enviar os dados incorretos (status 422)`, done => {
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

    it(`${urlBase}/${hero.id} - deve atualizar um herói e retornar o herói atualizado (status 200)`, done => {
      hero.name = faker.name.findName()
      hero.nickname = faker.name.findName()
      hero.email = faker.internet.email()

      request
        .put(`${urlBase}/${hero.id}`)
        .set('Accept', 'application/json')
        .send(hero)
        .end((erro, res) => {
          utils.validateResponse(res, 200)

          res.body.should.have.property('length').is.a.Number().be.equal(1)

          res.body.data.id.should.be.equal(hero.id)
          res.body.data.name.should.be.equal(hero.name)
          res.body.data.nickname.should.be.equal(hero.nickname)
          res.body.data.email.should.be.equal(hero.email)

          done()
        })
    })

    it(`${urlBase}/${hero.id} - não deve atualizar um herói se não enviar os dados (status 422)`, done => {
      request
        .put(`${urlBase}/${hero.id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase}/8888888888888 - não deve atualizar nenhum herói se enviar um id diferente do id dos dados (status 422)`, done => {
      let putHero = JSON.parse(JSON.stringify(hero))
      putHero.id = 9999999999999

      request
        .put(`${urlBase}/8888888888888`)
        .set('Accept', 'application/json')
        .send(putHero)
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(422, done)
    })

    it(`${urlBase}/9999999999999 - não deve atualizar nenhum herói se enviar um id inexistente (status 404)`, done => {
      let putHero = JSON.parse(JSON.stringify(hero))
      putHero.id = 9999999999999

      request
        .put(`${urlBase}/9999999999999`)
        .set('Accept', 'application/json')
        .send(putHero)
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

    it(`${urlBase}/${hero.id} - deve excluir um herói existente ao passar um id existente (status 204)`, done => {
      request
        .delete(`${urlBase}/${hero.id}`)
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(204, done)
    })

    it(`${urlBase}/9999999999999 - não deve excluir nenhum herói ao passar um id inexistente (status 404)`, done => {
      request
        .delete(urlBase + '/9999999999999')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .expect(404, done)
    })
  })
})

function Hero (id) {
  if (id) {
    this.id = id
  }

  this.name = 'Dr. Robert Bruce Banner'
  this.nickname = 'Hulk'
  this.email = 'hulk@marvel.com'
  this.phone = faker.phone.phoneNumberFormat().replace(/\D/g, '')
  this.birthday = null
  this.note = `O Hulk, por vezes referido como O Incrível Hulk (The Incredible Hulk, no original em inglês) é um personagem de quadrinhos/banda desenhada do gênero super-herói, propriedade da Marvel Comics, editora pela qual as histórias do personagem são publicados desde sua criação, nos anos 1960. Concebido pelo roteirista Stan Lee (1922-) e pelo desenhista Jack Kirby (1917-1994), teve sua primeira aparição junto ao público original dos Estados Unidos na revista The Incredible Hulk n°1, lançada no mercado americano pela Marvel Comics em maio de 1962, um título solo do personagem, garantindo-lhe o acesso ao que mais tarde seria popularmente conhecido como Universo Marvel dos quadrinhos/banda desenhada. A partir de então, o Hulk tem aparecido, protagonizando ou não, diversas histórias da editora, se tornando um dos mais visualmente reconhecíveis da mesma, tendo o universo entorno do personagem se expandido continuadamente ao longo das últimas décadas.

Apesar de fugir de diversos padrões pré-estabelecidos para super-heróis enquanto personagem da cultura pop mundial, Hulk é considerado um super-herói, mais pelas características sobre-humanas por ele apresentadas do que por conceitos bases de inserção no gênero.`
}
