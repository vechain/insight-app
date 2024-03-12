# VeChain Insight

> Insight is a **serverless** VeChain explorer. It allows you to explore and search for blocks, transactions and accounts.

[Try it out!](https://insight.vecha.in/#/)

## Permanent links

- Main net - `https://insight.vecha.in/#/main/txs/{txid}`
- Test net - `https://insight.vecha.in/#/test/txs/{txid}`

## Screenshots

![Homepage](./screenshots/homepage-chrome-app.png)

## Project setup

### Install dependencies

```
yarn
```

### Compiles with hot-reload for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

## Build and run with Docker

```
docker build -t insight-app .
```

```
docker run -dp 127.0.0.1:8080:80 insight-app
```

or with docker compose

```
docker compose up -d --build
```

## Run the app with a solo node 

inspector support running using a custom solo node address to be provided via .env config

### In your local machine 

Create a `.env` file with the url of the solo node you want to connect

```
VUE_APP_SOLO_URL=http://localhost:8080
```

### With docker 

Vue does not support runtime env variables, for this reason we need to provide them at build time

```
docker build -t insight-app --build-arg="VUE_APP_SOLO_URL=http://localhost:8080"
```

### With compose 

Pass the build args in the compose file directly. 

```
services:
  insight:
    build:
      context: .
      args:
        - VUE_APP_SOLO_URL=http://localhost:8669
    environment:
      NODE_ENV: production
    
    ports:
      - 8080:80
```


## Contributing

Everyone is always welcome to contribute on the codebase.
