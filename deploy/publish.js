const AWS = require('aws-sdk')
const fs = require('fs')
const async = require('async')
const mime = require('mime-types')
const globby = require('globby')

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

exports.setupFiles = async (deployConfig, callback) => {
  const s3BaseParams = {
    Bucket: deployConfig.bucket,
    ACL: 'public-read',
    Key: '',
    Body: '',
    CacheControl: '',
    ContentType: '',
  }

  // this setup is for a gatsby project
  const longCache = await globby(getLongCache(deployConfig.cacheType))

  // this setup is for a gatsby project
  const shortCache = await globby(getShortCache(deployConfig.cacheType))

  const longCacheFiles = buildObjects(longCache, 'public, max-age=31536000, immutable', s3BaseParams)
  const shortCacheFiles = buildObjects(shortCache, 'public, max-age=0, must-revalidate', s3BaseParams)

  const allFiles = longCacheFiles.concat(shortCacheFiles)
  //return allFiles
  callback(null, deployConfig, allFiles)
}

exports.uploadToS3 = async (deployConfig, allFiles, uploadCallback, uploadFilePromise = uploadFile) => {
  // for handling running feedback while files are uploading
  const uploadeFiles = []

  async.eachOfLimit(
    allFiles,
    4,
    function (value, key, callback) {
      uploadFilePromise(s3, value, deployConfig)
        .then((res) => {
          uploadeFiles.push(res)
          //
          // provide running feedback while uploading files
          console.log(`uploaded ${uploadeFiles.length}/${allFiles.length}`, value.Key)
          //
          callback()
        })
        .catch((err) => {
          console.error(' upload > error = ', err)
          callback(err)
        })
    },
    function (err) {
      if (err) {
        console.error('eachOfSeries had error: ', err.message)
        uploadCallback(err)
      }

      const allUploaded = uploadeFiles.length === allFiles.length
      uploadCallback(null, allUploaded)
    }
  )
}

// build the s3 file object with CacheControl and content type
const buildObjects = (fileArr, cacheControl, baseParams) => {
  return fileArr.map((file) => {
    return {
      ...baseParams,
      Key: file,
      CacheControl: cacheControl,
      ContentType: mime.lookup(file),
    }
  })
}

const uploadFile = (s3, s3FileObj, environment) => {
  return new Promise((resolve, reject) => {
    const localFilePath = s3FileObj.Key
    var fileStream = fs.createReadStream(localFilePath)

    // if file does not exist or cant be read
    fileStream.on('error', function (err) {
      console.log('File Error', err)
      reject(err)
    })

    //
    // remove the name of the build folder and replace with the s3Prefix
    // eg. ./public/someFile.html  -->  /www/someFile.html
    //
    const s3fileLocation = s3FileObj.Key.replace(environment.buildFolder, environment.s3Prefix)

    s3FileObj.Key = s3fileLocation
    s3FileObj.Body = fileStream

    s3.upload(s3FileObj, function (err, data) {
      if (err) {
        reject(err)
      }
      if (data) {
        resolve(data.Location)
      }
    })
  })
}

const getLongCache = (projectType) => {
  const CraCache = [
    './build/**',
    '!./build/*.json',
    '!./build/index.html',
    '!./build/favicon.ico',
    '!./build/logo192.png',
    '!./build/logo512.png',
    '!./build/robots.txt',
    '!./build/service-worker.js',
  ]

  const gatsbyCache = [
    './public/static/**/*',
    './public/**/*.js',
    './public/**/*.css',
    '!./public/service-worker.js',
    '!./public/sw.js',
  ]

  if (projectType === 'CRA' || projectType === 'gatsby') {
    return projectType === 'CRA' ? CraCache : gatsbyCache
  } else {
    throw new Error('longCache:: projectType does not match CRA or Gatsby')
  }
}

const getShortCache = (projectType) => {
  // this setup is for a gatsby project
  const gatsbyCache = ['./public/**/*.html', './public/page-data/**/*.json']

  const CraCache = [
    '!./build/**',
    './build/*.json',
    './build/index.html',
    './build/favicon.ico',
    './build/logo192.png',
    './build/logo512.png',
    './build/robots.txt',
    './build/service-worker.js',
  ]

  if (projectType === 'CRA' || projectType === 'gatsby') {
    return projectType === 'CRA' ? CraCache : gatsbyCache
  } else {
    throw new Error('shortcache:: projectType does not match CRA or Gatsby')
  }
}
