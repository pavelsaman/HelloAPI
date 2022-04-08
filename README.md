# Hello API

## Run in Docker

```
$ docker build . -t hello-api
$ docker run --rm -d -p 8080:4000 hello-api
```

## Run on localhost without Docker

```
$ npm install
$ npm run start
```

## Available methods

### GET /ping

### GET /hellos

- query parameters:
  - id
  - value

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