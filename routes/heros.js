'use strict'

let models = require('../models')
let express = require('express')
let router = express.Router()

let utils = require('./utils')

router.get('/', (req, res, next) => {
  let params
  let result = {
    messages: []
  }

  params = req.query

  models.Hero.findAndCountAll(
    utils.setWhere(params)
  ).then(heros => {
    result.data = heros.rows
    result.length = heros.count

    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.get('/:id', (req, res, next) => {
  let params = {}
  let result = {
    messages: []
  }

  params = req.query

  models.Hero.findById(
    req.params.id || -1,
    utils.setWhere(params)
  ).then(heros => {
    result.data = heros
    result.length = (heros) ? 1 : 0

    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', (req, res, next) => {
  let hero
  let result = {}

  hero = req.body

  if (!hero.id) {
    hero.id = (new Date()).valueOf()
  }

  models.Hero.create(
      hero
  ).then(hero => {
    result = {
      data: hero,
      length: null,
      messages: [{
        type: 'success',
        code: 201,
        detail: 'Registro incluído com sucesso'
      }]
    }

    res.writeHead(201, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.put('/:id', (req, res, next) => {
  let hero
  let where
  let result = {}

  hero = req.body

  where = {
    where: {
      id: req.params.id
    }
  }

  models.Hero.update(
    hero,
    where
  ).then(hero => {
    result = {
      data: {},
      length: null,
      messages: [{
        type: 'success',
        code: 200,
        detail: 'Registro alterado com sucesso'
      }]
    }

    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.delete('/:id', (req, res, next) => {
  let result = {
    data: {},
    length: null,
    messages: {}
  }

  models.Hero.destroy({
    where: {
      id: req.params.id
    }
  }).then(hero => {
    if (hero === 1) {
      result.messages = [{
        type: 'success',
        code: 200,
        detail: 'Registro excluído com sucesso'
      }]
    } else {
      result.messages = [{
        type: 'warning',
        code: 404,
        detail: 'Nenhum registro encontrado'
      }]
    }

    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

module.exports = router
