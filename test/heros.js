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
        .expect('Content-type', /json/)
        .expect('Content-type', /utf-8/)
        .end((erro, res) => {
          utils.validateResponse(res, 200, false)

          done()
        })
    })

    it(`${urlBase}/${hero.id} - deve retornar um único herói quando passa um id existente (status 200)`)

    it(`${urlBase}/9999999999999 - não deve retornar nenhum herói quando passa um id inexistente (status 404)`)
  })

  describe('POST', () => {
    it(`${urlBase} - deve incluir um novo herói e retornar o novo cliente (status 201)`)
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
