const AWS = require('aws-sdk')

class UsagePlanManager {
    config;
    apigateway;
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
/**
 * Creates a usageplanmanager object from the 
 * @constructor 
 */
    constructor(params)  {
        this.config = params
        this.apigateway = new AWS.APIGateway(this.config);
    }


    /** 
    * returns list of all enabled or disabled keys
    * @param {Boolean} isEnabled     - searches for enabled keys if true, disabled if false
    */
    async getApiKeysByEnabled(isEnabled) {
        let keyObjects;

        let params = {
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items.filter(item =>
                item.enabled === isEnabled
            );
        }).catch(err => { throw err; });
        return keyObjects;
    }

    /**
     *  inputs single string, returns all key objects matching any part of the string
     * @param {String} keyName     - part of a key name to search
     */
    async getApiKeyObjectsByPartialName(keyName) {
        let keyObjects;
        let params = {
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items.filter(item => item.name.match(keyName + ""));
        }).catch(err => { throw err });
        return keyObjects;
    }



    /** 
    * inputs single string, returns all key objects matching the name according to aws apigateway search
    * @param {String} keyName     - key name to search
    */
    async getApiKeyObjectsByName(keyName) {
        let keyObjects;

        let params = {
            nameQuery: keyName, //key id
            includeValues: true //requests key itself is returned
        };
        await this.apigateway.getApiKeys(params).promise().then(response => {
            keyObjects = response.items; // successful response
        }).catch(err => {
            throw err
        });
        return keyObjects;
    }


    /**         
    * inputs a single keyId as string value, returns an api key as a String
    * @param {String} keyId     - key id for search
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


    /**
    * inputs a single keyId as string value, returns an api key object
    * @param {String} planId    - plan id for search
    * @param {String} keyId     - key id for search
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

    /**
    * @param {Object} params                - Parameters to create an api key
    * @param {String} params.customerId     - Customer id of API key - marketplace customer identifier
    * @param {String} params.description    - Description of API key
    * @param {boolean} params.enabled       - Is the API key enabled
    * @param {String} params.name           - Name of API key
    * @param {String} params.value          - Sets the API key value    
    */
    async createApiKeyByParams(params) {
        let key;
        await this.apigateway.createApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }

    /**
    * Pass in a string to create an api key with that name
    * @param {String} keyName    - Name of api key
    */
    async createApiKeyByName(keyName) {
        let key;
        let params = {
            name: keyName,
            enabled: true
        };
        await this.apigateway.createApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }

    /**
    * gets usage plan object from an id
    *
    * @param {String} planId    - plan id for search
    */
    async getUsagePlanObjectById(planId) {
        let usagePlanObject;
        let params = {
            usagePlanId: planId
        };
        await this.apigateway.getUsagePlan(params).promise().then(item => usagePlanObject = item).catch(err => { throw err });
        return usagePlanObject;
    }

    /**
     * gets all usage plan objects on account
     * @returns 
     */
    async getAllUsagePlanObjects() {
        let usagePlanObject;
        let params = {};
        await this.apigateway.getUsagePlans(params).promise().then(item => usagePlanObject = item.items).catch(err => { throw err });
        return usagePlanObject;
    }

    /**
    * subscribe key to plan by passiong in api key id and usage plan id 
    * @param {String} planId    - plan id for search
    * @param {String} keyId     - key id for search
    */
    async subscribeKeyToPlanWithIds(planId, keyId) {
        let response;
        let params = {
            keyType: "API_KEY",
            keyId: keyId,
            usagePlanId: planId
        };
        await this.apigateway.createUsagePlanKey(params).promise().then(item => response = item).catch(err => { throw err });
        return response;
    }

    /**
    * Get usage plan data by plan id
    * @param {String} planId    - plan id for search
    * @param {String} startDate - start date for search. Must be in YYYY-MM-DD format
    * @param {String} endDate   - end date for search. Must be in YYYY-MM-DD format
    */
    async getUsageDataForPlan(planId, startDate, endDate) {
        let response;
        let params = {
            usagePlanId: planId,
            startDate: startDate,
            endDate: endDate
        };
        await this.apigateway.getUsage(params).promise().then(item => response = item).catch(err => { throw err });
        return response;
    }

    /**
     *Get usage plan data by plan id and key id 
     *
     * @param {String} planId    - plan id for search
     * @param {String} keyId     - key id for search
     * @param {String} startDate - start date for search. Must be in YYYY-MM-DD format
     * @param {String} endDate   - end date for search. Must be in YYYY-MM-DD format. End Date should be one day after when you want the end of the search to be.
     */
    async getUsageDataForPlanByKey(planId, keyId, startDate, endDate) {
        let response;
        let params = {
            usagePlanId: planId,
            keyId: keyId,
            startDate: startDate,
            endDate: endDate
        };
        await this.apigateway.getUsage(params).promise().then(item => response = item).catch(err => { throw err });
        return response;
    }

}

exports.UsagePlanManager = UsagePlanManager;