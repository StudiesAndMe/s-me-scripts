/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 18/01/2021.
 */

const deploy = require('../deploy')

const validLocation = './examples'
const validEnvType = 'staging'
const nonValidEnvType = 'test'

describe('read package.json', () => {
  it('should get the json in the example folder', (done) => {
    deploy.readPackageJson('staging', validLocation, (err, result) => {
      expect(err).toBe(null)
      console.log(' read-pkg.test > result = ', result)
      done()
    })
  })

  it('should handle non valid enviromentType', (done) => {
    deploy.readPackageJson(nonValidEnvType, validLocation, (err, result) => {
      expect(err.result).toBe(false)
      done()
    })
  })

  it('should handle if package.json is ont found', (done) => {
    deploy.readPackageJson(validEnvType, 'asda dasd', (err, result) => {
      expect(err.result).toBe(false)
      done()
    })
  })
})
