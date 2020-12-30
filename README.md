# s-me-scripts


### How to use
Install the package
```
npm i https://github.com/StudiesAndMe/s-me-scripts
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
    }
    "staging": {
        "s3Prefix": "www",
        "bucket": "the-id-of-the-s3-bucket",
        "distributionId": "the-cloudfront-distribution-id",
        "buildFolder": "./build", // the folder containing the build
        "cacheType": "CRA" // CRA or gatsby
    }
},
````

#### integrate into CI
Run the command 

***s-me-scripts deploy staging*** or ***s-me-scripts deploy production***  
