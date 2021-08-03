/**
 * Created by @author @ddennis - ddennis.dk aka fantastisk.dk/works aka meresukker.dk on 02/06/2021.
 */

const fs = require('fs')
const admZip = require('adm-zip')
const configGenerator = require('./config-generator')

const gitDownloadLink = 'https://github.com/StudiesAndMe/frontend-stack-cdk-template/archive/refs/heads/main.zip'
const dest = 'myfile.zip'
const OUTPUT_FOLDER = './infrastructure'

const request = require('superagent')

//"https://github.com/StudiesAndMe/frontend-stack-cdk-template/archive/refs/heads/main.zip"

module.exports = function setup(env) {
  configGenerator((err, result) => {
    if (result.deploy !== 'yes') {
      console.log('-------------------')
      console.log(' Setup terminated ')
      console.log('-------------------')
      return null
    }

    const p = './cdk-config.json'
    fs.writeFile(p, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(' setup > config file written = ')
      downloadUnzip(gitDownloadLink, dest, (err, result) => {
        console.log(' setup > err, result = ', err, result)
      })
    })
  })
}

const writeConfigFile = () => {}

function downloadUnzip(urlToZipFile, dest, cb) {
  console.log(' CDK > download ZIP file ')
  request
    .get(urlToZipFile)
    .on('error', function (error) {
      console.log(error)
      cb(error)
    })
    .pipe(fs.createWriteStream(dest))
    .on('finish', function () {
      // add code below to here
      console.log('zip file downloaded')
      var zip = new admZip(dest)
      console.log('unzip')
      zip.extractEntryTo('frontend-stack-cdk-template-main/', `./`, true, true)
      //zip.extractAllTo('./tester', true)

      const exist = fs.existsSync(OUTPUT_FOLDER)
      if (exist) {
        deleteDir(OUTPUT_FOLDER, (err, result) => {
          rename(cb)
        })
      } else {
        rename(cb)
      }
    })
}

function rename(cb) {
  fs.rename('./frontend-stack-cdk-template-main', OUTPUT_FOLDER, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Successfully renamed the directory.')

      fs.unlink('myfile.zip', (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('Deleted file zip file')
        cb(null, true)
        //file removed
      })
    }
  })
}

function deleteDir(dir, callback) {
  fs.rmdir(dir, { recursive: true }, (err, res) => {
    if (err) {
      console.error(err)
    }
    callback(err, res)
  })
}
