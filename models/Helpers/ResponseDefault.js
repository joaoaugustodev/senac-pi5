const response = {
  successLogin: {
    statusCode: 200,
    status: 'OK',
    message: 'Logado com sucesso',
    result: null
  },
  errorLogin: {
    statusCode: 500,
    status: 'Server error',
    message: 'Ocorreu um erro. Tente novamente mais tarde!',
    result: null
  },
  failLogin: {
    statusCode: 403,
    status: 'Forbidden',
    message: 'Usuário não permetido. E-mail ou Senha podem estar errados.',
    result: null
  },
  success: {
    statusCode: 200,
    status: 'OK',
    message: null,
    result: null
  },
  error: {
    statusCode: 403,
    status: 'Forbidden',
    message: null,
    result: null
  },
  error500: {
    statusCode: 500,
    status: 'Server error',
    message: 'Ocorreu um erro de servidor, por favor informe aos desenvolvedores',
    result: null
  },
  error401: {
    statusCode: 401,
    status: 'error request unauthorized',
    message: null,
    result: null
  },
  error404: {
    statusCode: 404,
    status: 'Not Found',
    message: null,
    result: null
  },
  removed: {
    statusCode: 200,
    status: 'OK',
    message: null,
    result: null
  }
}

module.exports = {
  send (prop, data = null, message = null) {
    response[prop].result = data

    if (message) {
      response[prop].message = message
    }

    return response[prop]
  }
}
