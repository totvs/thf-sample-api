'use strict'

let models = require('../models')
let express = require('express')
let router = express.Router()
let utils = require('./utils')

router.get('', (req, res, next) => {
  let result = {
    messages: []
  }

  models.Profile.findAndCountAll({
    pageId: req.query.pageId,
    userCode: req.query.userCode,
    dataCode: req.query.dataCode
  }).then(profiles => {
    result.data = profiles.rows
    result.length = profiles.count

    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', (req, res, next) => {
  let profile
  let result = {}

  if (Object.keys(req.body).length === 0) {
    utils.fnError(res, 'Pedido falhou pois não foram enviados dados', 422, {})
    return
  }

  profile = req.body
  if (!profile.id) {
    profile.id = (new Date()).valueOf()
  }

  models.Profile.create(
      profile
  ).then(profile => {
    result = {
      data: profile,
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

module.exports = router
