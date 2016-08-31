'use strict'

let models = require('../models')
let express = require('express')
let router = express.Router()
let contentType = {'Content-Type': 'application/json; charset=utf-8'}

function setWhere (params) {
  let i
  let orderAsc
  let propertyField
  let propertyValue
  let parameters = {
    offset: 0,
    limit: 10
  }

  if (params.start) {
    parameters.offset = params.start
  }

  if (params.limit && params.limit > 0) {
    parameters.limit = params.limit
  }

  // Campos do select
  if (params.fields) {
    if (!Array.isArray(params.fields)) {
      parameters.attributes = params.fields.split(',')
    } else {
      parameters.attributes = params.fields
    }
  }

  // Ordenação
  if (params.order) {
    parameters.order = params.order.split(',')

    if (params.asc) {
      orderAsc = params.asc.split(',')
      for (i = 0; i < parameters.order.length; i += 1) {
        if (orderAsc[i]) {
          parameters.order[i] = [parameters.order[i], orderAsc[i] === 'true' ? 'asc' : 'desc']
        }
      }
    }
  }

  if (params.property) {
    if (!Array.isArray(params.property)) {
      propertyField = params.property.split(',')
    } else {
      propertyField = params.property
    }

    if (!Array.isArray(params.value)) {
      propertyValue = params.value.split(',')
    } else {
      propertyValue = params.value
    }

    if (propertyField.length > 0 && propertyValue.length > 0) {
      parameters.where = {}

      for (i = 0; i < propertyField.length; i += 1) {
        if (propertyValue[i] && propertyField[i]) {
          if (propertyValue[i].indexOf('|') > -1) {
            parameters.where[propertyField[i]] = {
              $in: propertyValue[i].split('|')
            }
          } else if (propertyValue[i].indexOf(';') > -1) {
            parameters.where[propertyField[i]] = {
              $between: propertyValue[i].split(';')
            }
          } else if (propertyValue[i].indexOf('*') > -1) {
            parameters.where[propertyField[i]] = {
              $like: propertyValue[i].replace(/\*/g, '%')
            }
          } else if (propertyValue[i].indexOf('>=') === 0) {
            parameters.where[propertyField[i]] = {
              $gte: propertyValue[i].replace('>=', '')
            }
          } else if (propertyValue[i].indexOf('<=') === 0) {
            parameters.where[propertyField[i]] = {
              $lte: propertyValue[i].replace('<=', '')
            }
          } else if (propertyValue[i].indexOf('>') === 0) {
            parameters.where[propertyField[i]] = {
              $gt: propertyValue[i].replace('>', '')
            }
          } else if (propertyValue[i].indexOf('<') === 0) {
            parameters.where[propertyField[i]] = {
              $lt: propertyValue[i].replace('<', '')
            }
          } else {
            parameters.where[propertyField[i]] = propertyValue[i]
          }
        }
      }
    }
  }
  // if (params.where) {
  //    parameters.where = params.where;
  // }

  return parameters
}

function fnError405 (res) {
  let result = {
    data: {},
    length: 0,
    messages: [{
      type: 'error',
      code: 405,
      detail: 'Método não permitido'
    }]
  }

  res.writeHead(405, contentType)
  res.end(JSON.stringify(result))
}

function fnError (res, detail, code, data, length) {
  let result

  result = {
    data: data || [],
    length: length || 0,
    messages: [{
      type: 'error',
      code: code || 500,
      detail: detail
    }]
  }

  res.writeHead(code || 500, contentType)
  res.end(JSON.stringify(result))
}

router.get('/', (req, res, next) => {
  let params
  let result = {
    messages: []
  }

  params = req.query

  models.Customer.findAndCountAll(
      setWhere(params)
  ).then(customers => {
    result.data = customers.rows
    result.length = customers.count

    res.writeHead(200, contentType)
    res.end(JSON.stringify(result))
  }, error => {
    fnError(res, `${error.name}:${error.message}`)
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
    setWhere(params)
  ).then(customer => {
    result.data = customer || {}
    result.length = (customer) ? 1 : 0

    res.writeHead((customer) ? 200 : 404, contentType)
    res.end(JSON.stringify(result))
  }, error => {
    fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', (req, res, next) => {
  let customer
  let result = {}

  if (Object.keys(req.body).length === 0) {
    fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
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

    res.writeHead(201, contentType)
    res.end(JSON.stringify(result))
  }, error => {
    fnError(res, `${error.name}:${error.message}`, 422, {})
  })
})

router.post('/:id', (req, res, next) => {
  fnError405(res)
})

router.put('/:id', (req, res, next) => {
  let customer
  let where
  let result = {}

  if (Object.keys(req.body).length === 0) {
    fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
    return
  }

  if (req.params.id.toString() !== req.body.id.toString()) {
    fnError(res, 'Pedido falhou pois identificador da URI é diferente do id do objeto', 422, {})
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

      res.writeHead((customers) ? 200 : 404, contentType, contentType)
      res.end(JSON.stringify(result))
    }, error => {
      fnError(res, `${error.name}:${error.message}`)
    })
  }, error => {
    fnError(res, `${error.name}:${error.message}`)
  })
})

router.put('', (req, res, next) => {
  fnError405(res)
})

router.delete('/:id', (req, res, next) => {
  let result = {
    data: {},
    length: null,
    messages: {}
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

    res.writeHead(customer === 1 ? 204 : 404, contentType)
    res.end(JSON.stringify(result))
  }, error => {
    fnError(res, `${error.name}:${error.message}`)
  })
})

router.delete('', (req, res, next) => {
  fnError405(res)
})

module.exports = router
