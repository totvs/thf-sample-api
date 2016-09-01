'use strict'

let express = require('express')
let router = express.Router()
let utils = require('./utils')
let captchas = require('./captchas')

router.get('/suframaGetCaptcha', (req, res, next) => {
  let result = {
    messages: [],
    length: 1,
    data: {}
  }

  result.data = getCaptchaSuframa()

  if (!result.data.Captcha) {
    utils.fnError503(res)
  } else {
    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }
})

router.get('/getConsultaCPFCaptcha', (req, res, next) => {
  let result = {
    messages: [],
    length: 1,
    data: {}
  }

  result.data = getCaptchaCPF()

  if (!result.data.Captcha) {
    utils.fnError503(res)
  } else {
    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }
})

router.get('/getConsultaCNPJCaptcha', (req, res, next) => {
  let result = {
    messages: [],
    length: 1,
    data: {}
  }

  result.data = getCaptchaCNPJ()

  if (!result.data.Captcha) {
    utils.fnError503(res)
  } else {
    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }
})

router.get('/sintegraParcial', (req, res, next) => {
  let result = {
    messages: [],
    length: 1,
    data: {}
  }

  result.data = getCaptchaSintegraParcial()

  if (!result.data.Captcha) {
    utils.fnError503(res)
  } else {
    res.writeHead(200, utils.contentType)
    res.end(JSON.stringify(result))
  }
})

module.exports = router

function getCaptchaSuframa () {
  let captcha = (Math.floor(Math.random() * 10 + 1))

  return captchas[captcha]
}

function getCaptchaCPF () {
  let captcha = (Math.floor(Math.random() * 10 + 11))

  return captchas[captcha]
}

function getCaptchaCNPJ () {
  let captcha = (Math.floor(Math.random() * 10 + 21))

  return captchas[captcha]
}

function getCaptchaSintegraParcial () {
  let captcha = (Math.floor(Math.random() * 10 + 31))

  return captchas[captcha]
}
