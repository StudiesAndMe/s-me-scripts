// call cloudfront and invalidate cache
const AWS = require('aws-sdk')
exports.invalidate = (environment, callback) => {
  const cloudfront = new AWS.CloudFront()
  const params = {
    DistributionId: environment.distributionId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
    },
  }

  cloudfront.createInvalidation(params, function (err, data) {
    if (err) {
      console.error(err, err.stack)
      return callback(err)
    }
    callback(err, data)
  })
}
