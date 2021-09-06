#!/usr/bin/env node

// copy of https://github.com/ericclemmons/per-env/blob/master/bin/per-env to replace NODE_ENV with CI_ENVIRONMENT_NAME

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(`${process.cwd()}/package.json`)
const { spawnSync } = require('child_process')

// Default to "production"
const CI_ENVIRONMENT_NAME = process.env.CI_ENVIRONMENT_NAME || 'production'

const env = {

  // Default CI_ENVIRONMENT_NAME
  CI_ENVIRONMENT_NAME,
  // Override with package.json custom env variables
  ...(pkg && pkg['per-env'] && pkg['per-env'][CI_ENVIRONMENT_NAME]) || {},

  // Explicit env takes precedence
  ...process.env,
}

const command = 'npm'

console.log('##### env.CI_ENVIRONMENT_NAME: ', env.CI_ENVIRONMENT_NAME, ' #####')

const script = [
  env.npm_lifecycle_event, // e.g. "start"
  env.CI_ENVIRONMENT_NAME,
].join(':') // e.g. "start:development"

console.log('#####  selected script: ', script, '  #####')
const args = [
  'run',
  script,
].concat(
  // Extra arguments after "per-env"
  process.argv.slice(2),
)

const options = {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
}

const result = spawnSync(command, args, options)

process.exit(result.status)
