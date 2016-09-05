'use strict'

let models = require('../models')
let express = require('express')
let router = express.Router()

let utils = require('./utils')

router.get('', (req, res, next) => {
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
  ).then(hero => {
    result.data = hero || {}
    result.length = (hero) ? 1 : 0

    res.writeHead((hero) ? 200 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', (req, res, next) => {
  let hero
  let result = {}

  if (Object.keys(req.body).length === 0) {
    utils.fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
    return
  }

  hero = req.body
  if (!hero.id) {
    hero.id = (new Date()).valueOf()
  }

  models.Hero.create(
      hero
  ).then(hero => {
    result = {
      data: hero,
      length: 1,
      messages: [{
        type: 'success',
        code: 201,
        detail: 'Registro incluído com sucesso'
      }]
    }

    res.writeHead(201, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`, 422, {})
  })
})

router.post('/:id', (req, res, next) => {
  utils.fnError405(res)
})

router.put('/:id', (req, res, next) => {
  let hero
  let where
  let result = {}

  if (Object.keys(req.body).length === 0) {
    utils.fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
    return
  }

  if (req.params.id.toString() !== req.body.id.toString()) {
    utils.fnError(res, 'Pedido falhou pois identificador da URI é diferente do id do objeto', 422, {})
    return
  }

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
    models.Hero.findById(
        req.params.id
    ).then(heros => {
      result = {
        data: heros || {},
        length: (heros) ? 1 : 0,
        messages: [{
          type: (heros) ? 'success' : 'warning',
          code: (heros) ? 200 : 404,
          detail: (heros) ? 'Recurso alterado com sucesso' : 'Recurso não encontrado'
        }]
      }

      res.writeHead((heros) ? 200 : 404, utils.contentType, utils.contentType)
      res.end(JSON.stringify(result))
    }, error => {
      utils.fnError(res, `${error.name}:${error.message}`)
    })
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.put('', (req, res, next) => {
  utils.fnError405(res)
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
        code: 204,
        detail: 'Recurso excluído com sucesso'
      }]
    } else {
      result.messages = [{
        type: 'warning',
        code: 404,
        detail: 'Recurso não encontrado'
      }]
    }

    res.writeHead(hero === 1 ? 204 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.delete('', (req, res, next) => {
  utils.fnError405(res)
})

module.exports = router
