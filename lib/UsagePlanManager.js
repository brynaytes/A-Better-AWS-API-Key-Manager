const AWS = require('aws-sdk')

class UsagePlanManager {
    config;
    apigateway;


/**
 * Key Object
 * @typedef {Object} KeyObject
 * @property {String} id - api key id
 * @property {String} name - name of key 
 * @property {Boolean} enabled - is key enabled
 * @property {String} createdDate - Time stamp of key "2023-02-08T05:29:47.000"
 * @property {String} lastUpdatedDate - Time stamp of key's last update "2023-02-08T05:29:47.000"
 */

/**
 * Usage Plan Object
 * @typedef {Object} UsagePlanObject
 * @property {String} id - Usage Plan id
 * @property {String} name - name of Usage Plan 
 * @property {Array.<StageObject>} apiStages - name of Usage Plan 
*/

/**
 * Stage Object
 * @typedef {Object} StageObject
 * @property {String} apiId - Id of api 
 * @property {String} stage - Stage of api assocated with plan
*/

/**
 * Full Usage Object
 * @typedef {Object} FullUsageObject
 * @property {Array.<UsageObject>} KeyID - Id of api key, each item in the list represents one day.
*/

/**
 * Usage Object
 * @typedef {Object} UsageObject
 * @property {Array.<Number>} usageData - First number is used api requests, second is unused api requests
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
    * @returns {Array.<KeyObject>} items - list of key objects
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
     *  inputs single string, returns all key objects matching part of the string
     * @param {String} keyName     - part of a key name to search
     * @returns {Array.<KeyObject>} items - list of key objects
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
    * @returns {Array.<KeyObject>} items - list of key objects
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
    * @returns {KeyObject} - key object
    */
    async getApiKeyValueById(keyId) {
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
    * @param {String} keyId     - key id for search
    * @returns {KeyObject} - key object
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
     *  creates an api key based on a set of passed in parameters
    * @param {Object} params                - Parameters to create an api key
    * @param {String} params.customerId     - Customer id of API key - marketplace customer identifier
    * @param {String} params.description    - Description of API key
    * @param {boolean} params.enabled       - Is the API key enabled
    * @param {String} params.name           - Name of API key
    * @param {String} params.value          - Sets the API key value    
    * @returns {KeyObject} - key object
    */
    async createApiKeyByParams(params) {
        let key;
        await this.apigateway.createApiKey(params).promise().then(item => key = item).catch(err => { throw err });
        return key;
    }

    /**
    * Pass in a string to create an api key with that name
    * @param {String} keyName    - Name of api key
    * @returns {KeyObject} - key object
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
    * @returns {UsagePlanObject} - usage plan object
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
     * @returns {UsagePlanObject} - usage plan object
    */
    async getAllUsagePlanObjects() {
        let usagePlanObject;
        let params = {};
        await this.apigateway.getUsagePlans(params).promise().then(item => usagePlanObject = item.items).catch(err => { throw err });
        return usagePlanObject;
    }

    /**
    * subscribe key to plan by passing in api key id and usage plan id 
    * @param {String} planId    - plan id for search
    * @param {String} keyId     - key id for search
    * 
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
    * @param {Array.<FullUsageObject>} - list of usage objects
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
     * @param {Array.<FullUsageObject>} - list of usage objects
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