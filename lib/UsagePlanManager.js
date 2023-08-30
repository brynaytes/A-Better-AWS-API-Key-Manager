const AWS = require('aws-sdk')

class UsagePlanManager {


    /*
        Key Object:
        {
            "id": STRING,               //api key id
            "value": STRING,            //api key
            "name": STRING,             // name of key
            "enabled": boolean,         //is key enabled?
            "createdDate": STRING,      //Time stamp of key "2023-02-08T05:29:47.000"
            "lastUpdatedDate": STRING,  //Time stamp of key
            "stageKeys": []             //A list of Stage resources that are associated with the ApiKey resource.
        }
     */

    constructor() { }
    apigateway = new AWS.APIGateway({ region: 'us-east-1' });


    //returns list of all enabled or disabled keys
    async getApiKeysByEnabled(bol) {
        let keyObjects;

        let params = {
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items.filter(item =>
                item.enabled === bol
            );
        }).catch(err => { throw err; });
        return keyObjects;
    }

    //inputs single string, returns all key objects matching any part of the string
    async getApiKeyObjectsByPartialName(name) {
        let keyObjects;
        let params = {
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items.filter(item => item.name.match(name + ""));
        }).catch(err => { throw err });
        return keyObjects;
    }


    //inputs single string, returns all key objects matching the name according to aws apigateway search
    async getApiKeyObjectsByName(name) {
        let keyObjects;

        let params = {
            nameQuery: name, //key id
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items; // successful response
        }).catch(err => {
            throw err
        });
        return keyObjects;
    }


    /*
        inputs a single keyId as string value, returns an api key as a String
     */
    async getApiKeyById(keyId) {
        let key;
        let params = {
            apiKey: keyId, //key id
            includeValue: true //requests key itself is returned
        };
        await this.apigateway.getApiKey(params).promise().then(item => key = item.value).catch(err => { throw err });
        return key;
    }

    /*
        inputs a single keyId as string value, returns an api key object
     */
    async getApiKeyById(keyId) {
        let key;
        let params = {
            apiKey: keyId, //key id
            includeValue: true //requests key itself is returned
        };
        await this.apigateway.getApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }


    /*
    parameters to create an api key. Only 

     params = {
        customerId: 'STRING_VALUE',                 //Used to associate keys with larger groups
        description: 'STRING_VALUE',                //Description of the keys purpose
        enabled: true || false,                     //Sets if key is usable
        name: 'STRING_VALUE',                       //Name of key
        stageKeys: [
            {
                restApiId: 'STRING_VALUE',
                stageName: 'STRING_VALUE'
            },
        ],
        value: 'STRING_VALUE'                        //Allows you to set the key's value 
    };
    */
    async createApiKeyByParams(params) {
        let key;
        await this.apigateway.createApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }
    async createApiKeyByName(keyName) {
        let key;
        let params = {
            name: keyName,
            enabled : true
        };
        await this.apigateway.createApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }

    //gets usage plan object from an id
    async getUsagePlanObjectById(id) {
        let usagePlanObject;
        let params = {
            usagePlanId : id
        };
        await this.apigateway.getUsagePlan(params).promise().then(item => usagePlanObject = item).catch(err => { throw err });
        return usagePlanObject;
    }

    //gets all usage plan objects on account
    async getAllUsagePlanObjects() {
        let usagePlanObject;
        let params = {};
        await this.apigateway.getUsagePlans(params).promise().then(item => usagePlanObject = item.items).catch(err => { throw err });
        return usagePlanObject;
    }

    //subscribe key to plan by passiong in api key id and usage plan id 
    async subscribeKeyToPlanWithIds(keyId, planId){
            let response;
            let params = {
                keyType : "API_KEY",
                keyId : keyId,
                usagePlanId : planId
            };
            await this.apigateway.createUsagePlanKey(params).promise().then(item => response = item).catch(err => { throw err });
            return response;
    }

}

exports.UsagePlanManager = UsagePlanManager;