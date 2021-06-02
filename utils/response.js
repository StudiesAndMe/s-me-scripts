/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 18/01/2021.
 */
/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 07-03-2017.
 */

function getErrorResponse(msg, err = '', type = '') {
  return {
    result: false,
    type: type,
    msg: msg,
    err: err,
  }
}

function getSuccessResponse(data) {
  return {
    result: true,
    data: data,
  }
}

function validateReponse(err, result) {
  if (err) {
    return getErrorResponse(err)
  } else {
    return getSuccessResponse(result)
  }
}

module.exports = {
  validateReponse: validateReponse,
  getSuccessResponse: getSuccessResponse,
  getErrorResponse: getErrorResponse,
}
