#! /usr/bin/env node
/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 30/12/2020.
 */

'use strict'

const deploy = require('./deploy')
const cdkTemplate = require('./cdk-template/setup')
const args = process.argv.slice(2)

const [command] = process.argv.slice(2)
const [env] = process.argv.slice(3)

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err
})

const validCommands = ['deploy', 'cdk']
const scriptIndex = args.findIndex((x) => x === command)

if (scriptIndex === -1) {
  console.error(' index > no valid command was passed  ')
} else {
  if (command === 'deploy') {
    console.log(' index > run DEPLOY COMMAND ', env)
    return deploy(env)
  }

  if (command === 'cdk') {
    console.log(' index > run CDK COMMAND ')
    return cdkTemplate(env)
  }
}
