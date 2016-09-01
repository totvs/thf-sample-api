'use strict'

let express = require('express')
let bodyParser = require('body-parser')

let customers = require('./routes/customers')
let mashups = require('./routes/mashups')
let files = require('./routes/files')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

app.use('/api/v1/customers', customers)
app.use('/api/v1/mashups', mashups)
app.use('/api/v1/files', files)

app.use((req, res, next) => {
  res.status(404).send('Url inválida')
})

module.exports = app
