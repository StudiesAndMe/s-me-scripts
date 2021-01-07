# s-me-scripts

This package tried to consolidate our scripts folder and exposes a series of commands.


### How to use
Install the package
```
npm i https://github.com/StudiesAndMe/s-me-scripts
```

Run a command

```
s-me-scripts "command" "args"
```

## The "Deploy" command
This command helps deploy the build folder to the specified s3 bucket and invalidates the cloudfront distrubution.
It also sets the corrects file headers depending on the type of project. create-react-app and gatsby projects are supported  

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
