'use strict'

let models = require('../models')
let express = require('express')
let multer = require('multer')
let upload = multer({dest: 'uploads/'})
let router = express.Router()
let utils = require('./utils')

router.get('', (req, res, next) => {
  let result = {
    messages: []
  }

  models.File.findAndCountAll(
  ).then(files => {
    result.data = files.rows
    result.length = files.count

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

  models.File.findById(
    req.params.id || -1,
    utils.setWhere(params)
  ).then(file => {
    result.data = file || {}
    result.length = (file) ? 1 : 0

    res.writeHead((file) ? 200 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

router.post('', upload.array('file', 10), (req, res, next) => {
  let result = {}
  let file = {
    id: req.body.id || (new Date()).valueOf(),
    originalName: req.files[0].originalname,
    fileName: req.files[0].filename,
    size: req.files[0].size
  }

  models.File.create(
    file
  ).then(file => {
    result = {
      data: file,
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

router.delete('', (req, res, next) => {
  utils.fnError405(res)
})

router.delete('/:id', (req, res, next) => {
  let result = {
    data: {},
    length: 0,
    messages: []
  }

  models.File.destroy({
    where: {
      id: req.params.id
    }
  }).then(file => {
    if (file === 1) {
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

    res.writeHead(file === 1 ? 204 : 404, utils.contentType)
    res.end(JSON.stringify(result))
  }, error => {
    utils.fnError(res, `${error.name}:${error.message}`)
  })
})

module.exports = router
