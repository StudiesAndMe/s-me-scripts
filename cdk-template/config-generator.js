'use strict'
var inquirer = require('inquirer')

//const chalkPipe = require('chalk-pipe')

/*{
	"CdkTemplateStackId": "tester-stack",
	"PROJECT_NAME": "tester-",
	"ENV_TYPE": "staging",
	"FRONTEND_BUILD_FOLDER": "../build",
	"HOSTED_DOMAIN_NAME": "studies-and-me.com",
	"PUBLIC_HOSTED_ZONE": true,
	"env": { "account": "736365631927", "region": "eu-central-1" }
}*/

const CRA_BUILD_FOLDER = '../build'
const GATSBY_BUILD_FOLDER = '../public'

const CRA_OPTION = 'create-react-app'
const GATSBY_OPTION = 'gatsby'

module.exports = function (callback) {
  startGenerator().then((result) => {
    callback(null, result)
  })
}

let projectName = ''

function startGenerator() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'PROJECT_NAME',
        message: 'What is the project name:',
        validate(s) {
          //@console.log(' tester > s = ', s)

          if (s.indexOf(' ') !== -1) {
            return 'Spaces is not valid'
          }

          projectName = s
          return s.length > 2 ? true : 'you need to write proper name'
        },
      },

      {
        type: 'input',
        name: 'CdkTemplateStackId',
        message: 'Stack Id:',
        validate(s) {
          return s.length > 4 ? true : 'you need to write proper stack id'
        },
        default() {
          return projectName + '-stack'
        },
      },

      {
        type: 'list',
        name: 'FRONTEND_BUILD_FOLDER',
        message: 'Frontend project type',
        choices: [CRA_OPTION, GATSBY_OPTION],
      },

      {
        type: 'input',
        name: 'PUBLIC_HOSTED_ZONE',
        message: 'public',
        default() {
          return 'false'
        },
      },
	  
      {
        type: 'input',
        name: 'HOSTED_DOMAIN_NAME',
        message: 'domain',
        default() {
          return 'studies-and-me.com'
        },
      },

      {
        type: 'input',
        name: 'HOSTED_DOMAIN_NAME',
        message: 'domain',
        default() {
          return 'studies-and-me.com'
        },
      },

      {
        type: 'input',
        name: 'account',
        message: 'domain',
        default() {
          return '736365631927'
        },
      },

      {
        type: 'input',
        name: 'region',
        message: 'AWS region',
        default() {
          return 'eu-central-1'
        },
      },
      {
        type: 'list',
        name: 'deploy',
        message: 'Do you want to save this config',
        choices: ['no', 'yes'],
      },
    ])
    .then((answers) => {
      const buildFolder = answers.FRONTEND_BUILD_FOLDER === CRA_OPTION ? CRA_BUILD_FOLDER : GATSBY_BUILD_FOLDER

      const obj = {
        PROJECT_NAME: answers.PROJECT_NAME,
        CdkTemplateStackId: answers.CdkTemplateStackId,
        FRONTEND_BUILD_FOLDER: buildFolder,
        HOSTED_DOMAIN_NAME: answers.HOSTED_DOMAIN_NAME,
	PUBLIC_HOSTED_ZONE: answers.PUBLIC_HOSTED_ZONE,      
        env: { account: answers.account, region: answers.region },
        deploy: answers.deploy,
      }

      return obj
    })
}
