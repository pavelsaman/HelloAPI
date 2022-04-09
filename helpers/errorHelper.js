const fs = require('fs');

const LOG_FILE = './logs/log.txt';

function createErrorMessage (err, req) {
  let errorMessage = `Timestamp: ${new Date().getTime()}\n`;
  errorMessage += 'Error object:\n';
  errorMessage += JSON.stringify(err) + '\n';
  if (req) {
    errorMessage += 'Request object:\n';
    errorMessage += JSON.stringify(createReqObject(req)) + '\n';
  }
  errorMessage += '='.repeat(80) + '\n';

  return errorMessage;
}

function createReqObject (req) {
  return {
    version: req.httpVersion,
    baseUrl: req.baseUrl,
    path: req.originalUrl,
    method: req.method,
    headers: req.rawHeaders,
    params: req.params,
    query: req.query,
    body: req.body,
  };
}

function writeLog (data, resolve, reject) {
  fs.appendFile(LOG_FILE, data, function (err) {
    if (err) reject(err);
    else resolve();
  })
}

const errorHelpers = {
  logToConsole: function (err, req, res, next) {
    console.log(err);
    next(err);
  },
  logTofile: function (err, req, res, next) {
    const errorMessage = createErrorMessage(err, req);
    writeLog(errorMessage, function (errorMessage) {
      console.log(errorMessage);
    }, function (err) {
      console.log(err);
    });
    next(err);
  },
  clientError: function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        let formattedError = {
          status: err.statusCode,
          statusText: 'Bad Request',
          message: err.message,
          error: {
            code: 'BAD_REQUEST',
            message: err.message,
          },
        };
        const errorMessage = createErrorMessage(err, req);
        writeLog(errorMessage, function (errorMessage) {
          console.log(errorMessage);
        }, function (err) {
          console.log(err);
        });
        return res.status(err.statusCode).json(formattedError);
    }
    next(err);
  },
  generalError: function (err, req, res, next) {
    if (err instanceof Error) {
      let formattedError = {
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Internal server error.',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error.',
        },
      };
      return res.status(500).json(formattedError);
    }
  },
};

module.exports = errorHelpers;
