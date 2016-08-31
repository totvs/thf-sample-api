'use strict'

let supertest = require('supertest')
let app = require('../app')
let request = supertest(app)

module.exports = request
