# HoneyFramework Web App

# Development

## Run the project

```
git clone https://github.com/bitfinexcom/bfx-hf-ui-core.git
cd bfx-hf-ui-core
npm install
npm start
```

## Environment

Standard Environment variables include:

| name                | values              | description                            |
| ------------------- | ------------------- | -------------------------------------- |
| CI_ENVIRONMENT_NAME | staging\|production | Use to set config based on environment |

## Test production/staging build

Install serve package globally

```
npm install -g serve
```

Build and serve it

```
CI_ENVIRONMENT_NAME=staging npm run build
# CI_ENVIRONMENT_NAME=production npm run build
serve -p 3000 -s build
```
