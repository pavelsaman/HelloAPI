const express = require('express');
const app = express();
const router = express.Router();
const helloRepo = require('./repos/helloRepo');
require('dotenv').config();

const API_PATH = process.env.API_PATH_PREFIX;
const API_VERSION = process.env.API_VERSION;
const PORT = process.env.PORT;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      let formattedError = {
        status: err.statusCode,
        statusText: 'Bad Request',
        message: err.message,
        error: {
          code: 'BAD_REQUEST',
          message: err.message,
        },
      }
      return res.status(err.statusCode).json(formattedError);
  }
  next();
});

router.get('/ping', function (req, res, next) {
  res.status(200).json({
    status: 200,
    statusText: 'OK',
    message: 'pong',
  });
});

router.get('/hellos', function (req, res, next) {
  const value = req.query.value;
  const id = req.query.id;
  
  if (value || id) {
    const searchObject = { value, id };
    helloRepo.search(searchObject, function (data) {
      if (data.length > 0) {
        res.status(200).json({
          status: 200,
          statusText: 'OK',
          message: `Hellos with value '${req.query.value}' returned.`,
          data: data,
        });
      } else {
        let error_message;
        if (value && id) {
          error_message = `No hello with value '${req.query.value}' and id ${req.query.id} found.`;
        } else {
          if (value) error_message = `No hello with value '${req.query.value}' found.`;
          if (id) error_message = `No hello with id ${req.query.id} found.`;
        }
        res.status(404).json({
          status: 404,
          statusText: 'Not Found',
          message: error_message,
          error: {
            code: 'NOT_FOUND',
            message: error_message,
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

app.use(`${API_PATH}${API_VERSION}`, router);

const server = app.listen(PORT, function () {
  console.log(`Node server is running on http://localhost:${PORT}${API_PATH}`);
});
