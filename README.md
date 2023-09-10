
# The-Missing-SDK-For-AWS-API-Gateway

The AWS SDK can be clunky, particularly when dealing with API keys, usage plans, and usage data.

The goal of this package is to create functionality that is currently required to be built manually by developers.

## Example Client
```javascript
var config = {
    region: 'us-east-1' //or whatever your region is 
}
const gate = new UsagePlanManager(config);
```

A full list of config variables can be found in the AWS docs under the [constructor property](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#constructor-property) section.