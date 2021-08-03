/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 19/07/2021.
 */

const configGenerator = require('../cdk-template/config-generator')

test('renders learn react link', () => {
  configGenerator((err, result) => {
    console.log(' cdk.test > result = ', result)
  })

  expect(true).toEqual(true)
})
