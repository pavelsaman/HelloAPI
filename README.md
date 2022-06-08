# Hello API

## Run in Docker

```
$ docker build . -t hello-api
$ docker run --rm -d -p 8080:4000 hello-api
```

or get from a Docker repo here https://hub.docker.com/r/samanpavel/hello-api.

## Run on localhost without Docker

```
$ npm install
$ npm run start
```

## Test

You can use mocha or jest to run the tests. Run one of these commands:

```
$ yarn test
$ yarn test:jest
```

Mocha is used along with `nyc` to generate test coverage.

## Available methods

### GET /ping

### OPTIONS /

### OPTIONS /hellos

### GET /hellos

- query parameters:
  - id
  - value
  - lang

### GET /hellos/:id

### POST /hellos

- example body:

```json
{
    "id": 6,
    "value": "Ciao",
    "lang": "it"
}
```

### DELETE /hellos/:id

### PUT /hellos/:id

- example body:

```json
{
    "value": "Ciao",
    "lang": "it"
}
```

### PATCH /hellos/:id

- example body:

```json
{
    "value": "Ciao"
}
```
