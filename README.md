# s-me-scripts

This package tries to consolidate our scripts folder and exposes a series of commands.

### General todos
- [ ] add help command
- [ ] examples folder

### How to use
Install the package
```
npm i https://github.com/StudiesAndMe/s-me-scripts
```

Run a command

```
s-me-scripts "command" "args"
```

Depending on your setup, this is how to directly run it

```
node node_modules/s-me-scripts "command" "args"
```



## The "cdk" command

The cdk command builds a stack using aws cdk.
A command-line interface will ask you some question and generate a stack for you.
The stack will auto deploy any branch you create on your repo.

The CLI with generate a cdk-config.json file which the stack will use and a **infrastucture**
folder containing the actual stack. the contents of the **infrastucture** folder is pulled from this repo **https://github.com/StudiesAndMe/frontend-stack-cdk-template**

Using the "cdk" command
```
s-me-scripts cdk 
```

#### TODO

- [ ] generate the circleCi config.yaml
- [ ] set custom file headers

.....


## The "deploy" command
This command helps deploy the build folder to the specified s3 bucket and invalidates the cloudfront distrubution.
It also sets the corrects file headers depending on the type of project. create-react-app and gatsby projects are supported  

Example - using the "deploy" command
```
s-me-scripts deploy staging
```

Add a section like this to the package.json of your project and fill out the details

```` 
"s-me-deployment": {
    "staging": {
        "s3Prefix": "www",
        "bucket": "the-id-of-the-s3-bucket",
        "distributionId": "the-cloudfront-distribution-id",
        "buildFolder": "./build", // the folder containing the build
        "cacheType": "CRA" // CRA or gatsby
    },
    "production": {
        "s3Prefix": "www",
        "bucket": "the-id-of-the-s3-bucket",
        "distributionId": "the-cloudfront-distribution-id",
        "buildFolder": "./build", // the folder containing the build
        "cacheType": "CRA" // CRA or gatsby
    }
},
````

#### integrate into CI

Easiest way is to add a npm script in the package.json and then run it from the config.yml

````
"deploy-staging": "s-me-scripts deploy staging"
````

from the config.yml
````
- run:
      name: Deploying to staging
      command: |
        npm run deploy-staging
````


Its also possible to define the env directly ***"deploy": "s-me-scripts deploy"*** from the CI "npm run deploy" staging     
