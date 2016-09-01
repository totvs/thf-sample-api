let contentType = {'Content-Type': 'application/json; charset=utf-8'}

module.exports = {
  contentType,
  setWhere,
  fnError405,
  fnError503,
  fnError
}

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

function fnError503 (res) {
  let result = {
    data: {},
    length: 0,
    messages: [{
      type: 'error',
      code: 503,
      detail: 'Serviço indisponível'
    }]
  }

  res.writeHead(503, contentType)
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
