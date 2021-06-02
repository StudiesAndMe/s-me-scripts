// while testing get the aws credentials from an .env file
// the env file should contain
// AWS_ACCESS_KEY_ID=***********
// AWS_SECRET_ACCESS_KEY=********************
//

// get the .env file
require('dotenv').config()
//
const AWS = require('aws-sdk')
const publish = require('../publish')

const curDir = process.cwd()
if (curDir.indexOf('examples') === -1) {
  console.log(' upload-test > change directory = ')
  process.chdir('./examples')
}

AWS.config.update({
  region: 'eu-central-1',
  signatureVersion: 'v4',
  accessKeyId: '',
  secretAccessKey: '',
  credentials: '',
})

//deploy('staging')
const enviroment = {
  s3Prefix: '',
  bucket: process.env.BUCKET_NAME,
  distributionId: 'the-cloudfront-distribution-id',
  buildFolder: './test-build',
  cacheType: 'CRA',
}

publish.uploadToS3(enviroment, (err, result) => {
  console.log(' uoload-test > err = ', err)
  console.log(' uoload-test > result = ', result)
})
