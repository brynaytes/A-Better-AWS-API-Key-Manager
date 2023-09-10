
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




## Methods

### getApiKeysByEnabled
returns list of all enabled or disabled keys

```javascript
await gate.getApiKeysByEnabled(true);
```

### getApiKeyObjectsByPartialName
Accepts a single string, returns all key objects matching part of the string

```javascript
await gate.getApiKeyObjectsByPartialName("part_of_a_key_name")
```

### getApiKeyObjectsByPartialName
 inputs single string, returns all key objects matching the name according to aws apigateway search

```javascript
await gate.getApiKeyObjectsByName("full_key_name")
```

### getApiKeyById
inputs a single keyId as string value, returns an api key object

```javascript
await gate.getApiKeyById("keyID")
```


### getApiKeyValueById
inputs a single keyId as string value, returns an api key as a String

```javascript
await gate.getApiKeyValueById("keyID")
```

### createApiKeyByParams
creates an api key based on a set of passed in parameters

```javascript
let params = {
    name : "Key-Name", //required
    value : "ValueOfApiKey",
    description : "Description",
    enabled : "true",
}

await gate.createApiKeyByParams(params)
```

### createApiKeyByName
creates an api key based on a set of passed in parameters

```javascript
await gate.createApiKeyByName("key-Name")
```

### getUsagePlanObjectById
Gets usage plan object from a usage plan id

```javascript
await gate.getUsagePlanObjectById("UsagePlanId")
```

### getAllUsagePlanObjects
gets all usage plan objects on account

```javascript
await gate.getAllUsagePlanObjects()
```

### subscribeKeyToPlanWithIds
subscribe key to plan by passing in api key id and usage plan id 

```javascript
await gate.subscribeKeyToPlanWithIds("planId","keyId")
```

### getUsageDataForPlan
Get usage data for a plan by plan id
The first date should be the start date for timeframe, the last date should be one day after the end of your timeframe.

```javascript
await gate.getUsageDataForPlan("planId","YYYY-MM-DD","YYYY-MM-DD")
```

### getUsageDataForPlanByKey
Get usage data for a plan and specific key by plan and key id
The first date should be the start date for timeframe, the last date should be one day after the end of your timeframe.

```javascript
await gate.getUsageDataForPlanByKey("planId","keyId","YYYY-MM-DD","YYYY-MM-DD")
```




## TODO

* Unsubscribe key from plan
* Extend usage of key


