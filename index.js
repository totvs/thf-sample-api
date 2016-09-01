'use strict'

let app = require('./app')
let models = require('./models')

app.set('port', process.env.PORT || 3000)

models.sequelize.sync().then(() => {
  let server = app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + server.address().port)
  })
})
