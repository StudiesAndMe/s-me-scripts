const AWS = require('aws-sdk')
const async = require('async')
const publish = require('./publish')
const invalidate = require('./invalidate')
const response = require('../utils/response')
const isCircleCI = process.env.CI && process.env.CI.toString() === 'true'
const readPkgUp = require('read-pkg-up')

//
// testing this locally requires MFA from the command line.
// login from the command line with mfa
// aws sts getReq-session-token --serial-number arn:aws:iam::000000:mfa/username  --token-code 123456 --profile your-leoilab-profile
// copy the credentials to you .aws/credentials under the mfa user
//
var credentials = new AWS.SharedIniFileCredentials({ profile: 'mfa' })

AWS.config.update({
  region: 'eu-central-1',
  signatureVersion: 'v4',
  accessKeyId: '',
  secretAccessKey: '',
  credentials: isCircleCI ? '' : credentials,
})

function deploy(environmentType) {
  console.log(' deploy > read = ', environmentType)

  async.waterfall(
    [
      function (callback) {
        readPackageJson(environmentType, '.', callback)
      },
      function (deployConfig, callback) {
        console.log(' setupDeploy >  = ', deployConfig)

        publish.setupFiles(deployConfig, callback)
      },

      function (deployConfig, files, callback) {
        const upload = (err, result) => {
          return Promise.resolve()
        }

        console.log(' setupDeploy > files = ', files)
        publish.uploadToS3(
          deployConfig,
          files,
          (err, result) => {
            console.log(' setupDeploy > err, result = ', err, result)
          },
          upload
        )
      },

      /*function (config, callback) {
        publish.uploadToS3(config, callback)
      },
      function (uploadResult, callback) {
        publish.invalidate(config, callback)
      },*/
    ],
    function (err, result) {
      if (err) {
        console.error('deploy > err = ', result)
        throw new Error(err)
        return
      }

      console.log('deploy > cloudfront invalidated = ', result)
    }
  )

  /*  if (!hasValidEnvironment(environmentType)) {
    const e = 'environmentType should be either staging or production'
    return callback(response.getErrorResponse(e))
  }

  readPackageJson(environmentType, (err, config) => {
    if (err) {
      throw new Error(err)
      return
    }

    console.log(' deploy > config = ', config)
    //runDeployment(environmentType, config)
  })*/
}

function hasValidEnvironment(environmentType) {
  return environmentType === 'staging' || environmentType === 'production'
}

function runDeployment(environmentType, config) {
  async.waterfall(
    [
      function (config, callback) {
        publish.uploadToS3(config, callback)
      },
      function (uploadResult, callback) {
        publish.invalidate(config, callback)
      },
    ],
    function (err, result) {
      if (err) {
        console.error('deploy > err = ', result)
        throw new Error(err)
        return
      }

      console.log('deploy > cloudfront invalidated = ', result)
    }
  )
}

function readPackageJson(environmentType, folder, callback) {
  if (!hasValidEnvironment(environmentType)) {
    const e = 'environmentType should be either staging or production'
    return callback(response.getErrorResponse(e))
  }

  readPkgUp({ cwd: folder })
    .then((res) => {
      const deploymentBlock = res.packageJson['s-me-deployment']

      if (!deploymentBlock) {
        const e = 's-me-deployment block is missing in package.json'
        return callback(response.getErrorResponse(e))
      }

      const config = deploymentBlock[environmentType]
      callback(null, config)
    })
    .catch((error) => {
      callback(error)
    })
}

module.exports = {
  deploy: deploy,
  readPackageJson,
  runDeployment,
}
