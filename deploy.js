const AWS = require('aws-sdk')
const async = require('async')
const publish = require('./publish')
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

module.exports = function deploy(environmentType) {
  readPkgUp()
    .then((res) => {
      // should find s-me-deployment in package json
      const configDeploymentBlock = res.packageJson['s-me-deployment']
      if (!configDeploymentBlock) {
        throw new Error('No s-me-deployment object found in package.json file')
      }

      // should find either staging or production
      const config = res.packageJson['s-me-deployment'][environmentType]
      if (!config) {
        throw new Error(`environmentType ${environmentType} not found inside s-me-deployment`)
      }

      async.waterfall(
        [
          function (callback) {
            publish.uploadToS3(config, callback)
          },
          function (uploadResult, callback) {
            console.log('deploy > All files uploaded = ', uploadResult)
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
    })
    .catch((err) => {
      throw new Error(err)
    })
}
