const express = require('express');
const app = express();
const router = express.Router();
const helloRepo = require('./repos/helloRepo');
require('dotenv').config();
const errorHandlers = require('./helpers/errorHelper');

const API_PATH = process.env.API_PATH_PREFIX;
const API_VERSION = process.env.API_VERSION;
const PORT = process.env.PORT;

app.use(express.json());
app.use(errorHandlers.clientError);

router.get('/ping', function (req, res, next) {
  res.status(200).json({
    status: 200,
    statusText: 'OK',
    message: 'pong',
  });
});

router.options('/', function (req, res, next) {
  res.set('Allow', 'OPTIONS, GET, POST, PUT, PATCH, DELETE').send();
});

router.options('/hellos', function (req, res, next) {
  res.set('Allow', 'OPTIONS, GET, POST').send();
});

router.get('/hellos', function (req, res, next) {
  const value = req.query.value;
  const id = req.query.id;
  const lang = req.query.lang;
  
  if (value || id || lang) {
    const searchObject = { value, id, lang };
    helloRepo.search(searchObject, function (data) {
      if (data.length > 0) {
        res.status(200).json({
          status: 200,
          statusText: 'OK',
          message: 'Hellos according to search criteria returned.',
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: 'Not Found',
          message: 'No hellos found.',
          error: {
            code: 'NOT_FOUND',
            message: 'No hellos found.',
          },
        });
      }
    }, function (err) {
      next(err);
    });
  } else {
    helloRepo.get(function (data) {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'All hellos returned.',
        data: data,
      });
    }, function (err) {
      next(err);
    });
  }
});

router.get('/hellos/:id', function (req, res, next) {
  helloRepo.getById(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'Specific hello returned.',
        data: data,
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: 'Not Found',
        message: `No hello with id ${req.params.id} found.`,
        error: {
          code: 'NOT_FOUND',
          message: `No hello with id ${req.params.id} found.`,
        },
      });
    }
  }, function (err) {
    next(err);
  });
});

router.post('/hellos', function (req, res, next) {
  if (!req.body || !req.body?.value || !req.body?.lang) {
    res.status(400).json({
      status: 400,
      statusText: 'Bad Request',
      message: 'No body provided.',
      error: {
        code: 'BAD_REQUEST',
        message: 'No body provided.',
      },
    });
  } else {
    helloRepo.insert(req.body, function (data) {
      res.status(201).json({
        status: 201,
        statusText: 'Created',
        message: 'New resource created.',
        data: data,
      });
    }, function (err) {
      next(err);
    });
  }
});

router.delete('/hellos/:id', function (req, res, next) {
  helloRepo.getById(req.params.id, function (data) {
    if (data) {
      helloRepo.delete(req.params.id, function () {
        res.status(204).send();
      }, function (err) {
        next(err);
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: 'Not Found',
        message: `No hello with id ${req.params.id} found.`,
        error: {
          code: 'NOT_FOUND',
          message: `No hello with id ${req.params.id} found.`,
        },
      });
    }
  }, function (err) {
    next(err);
  });
});

router.put('/hellos/:id', function (req, res, next) {
  if (!req.body || !req.body?.value || !req.body?.lang) {
    res.status(400).json({
      status: 400,
      statusText: 'Bad Request',
      message: 'No body or wrong body provided.',
      error: {
        code: 'BAD_REQUEST',
        message: 'No body or wrong body provided.',
      },
    });
  } else {
    helloRepo.getById(req.params.id, function (data) {
      if (data) {
        helloRepo.update(req.params.id, req.body, function (data) {
          res.status(200).json({
            status: 200,
            statusText: 'OK',
            message: 'Resource updated.',
            data: data,
          });
        }, function (err) {
          next(err);
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: 'Not Found',
          message: `No hello with id ${req.params.id} found.`,
          error: {
            code: 'NOT_FOUND',
            message: `No hello with id ${req.params.id} found.`,
          },
        });
      }
    }, function (err) {
      next(err);
    });
  }
});

router.patch('/hellos/:id', function (req, res, next) {
  if (!req.body || (!req.body?.value && !req.body?.lang)) {
    res.status(400).json({
      status: 400,
      statusText: 'Bad Request',
      message: 'No body or wrong body provided.',
      error: {
        code: 'BAD_REQUEST',
        message: 'No body or wrong body provided.',
      },
    });
  } else {
    helloRepo.getById(req.params.id, function (data) {
      if (data) {
        helloRepo.update(req.params.id, req.body, function (data) {
          res.status(200).json({
            status: 200,
            statusText: 'OK',
            message: 'Resource updated.',
            data: data,
          });
        }, function (err) {
          next(err);
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: 'Not Found',
          message: `No hello with id ${req.params.id} found.`,
          error: {
            code: 'NOT_FOUND',
            message: `No hello with id ${req.params.id} found.`,
          },
        });
      }
    }, function (err) {
      next(err);
    });
  }
});

app.use(`${API_PATH}${API_VERSION}`, router);

app.use(errorHandlers.logToConsole);
app.use(errorHandlers.logTofile);
app.use(errorHandlers.generalError);

const server = app.listen(PORT, function () {
  console.log(`Node server is running on http://localhost:${PORT}${API_PATH}`);
});
