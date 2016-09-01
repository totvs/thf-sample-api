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

  models.Customer.findAndCountAll(
      utils.setWhere(params)
  ).then(customers => {
    result.data = customers.rows
    result.length = customers.count

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

  models.Customer.findById(
    req.params.id || -1,
    utils.setWhere(params)
  ).then(customer => {
    result.data = customer || {}
    result.length = (customer) ? 1 : 0

    res.writeHead((customer) ? 200 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', (req, res, next) => {
  let customer
  let result = {}

  if (Object.keys(req.body).length === 0) {
    utils.fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
    return
  }

  customer = req.body
  if (!customer.id) {
    customer.id = (new Date()).valueOf()
  }

  models.Customer.create(
      customer
  ).then(customer => {
    result = {
      data: customer,
      length: 1,
      messages: [{
        type: 'success',
        code: 201,
        detail: 'Recurso criado com sucesso'
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
  let customer
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

  customer = req.body

  where = {
    where: {
      id: req.params.id
    }
  }

  models.Customer.update(
    customer,
    where
  ).then(customer => {
    models.Customer.findById(
        req.params.id
    ).then(customers => {
      result = {
        data: customers || {},
        length: (customers) ? 1 : 0,
        messages: [{
          type: (customers) ? 'success' : 'warning',
          code: (customers) ? 200 : 404,
          detail: (customers) ? 'Recurso alterado com sucesso' : 'Recurso não encontrado'
        }]
      }

      res.writeHead((customers) ? 200 : 404, utils.contentType, utils.contentType)
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
    length: 0,
    messages: []
  }

  models.Customer.destroy({
    where: {
      id: req.params.id
    }
  }).then(customer => {
    if (customer === 1) {
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

    res.writeHead(customer === 1 ? 204 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.delete('', (req, res, next) => {
  utils.fnError405(res)
})

module.exports = router
