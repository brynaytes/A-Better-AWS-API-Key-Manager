const AWS = require('aws-sdk')

class UsagePlanManager {
    constructor() {

    }

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
    apigateway = new AWS.APIGateway({region: 'us-east-1'});


    //returns list of all enabled or disabled keys
    async getApiKeysByEnabled(bol){
        try {
            return new Promise(async (resolve, reject) => {
                let params = {
                    includeValues: true //requests key itself is returned
                };
                try {
                    await this.apigateway.getApiKeys(params, function (err, data) {
                        let keyInfoList;

                        if (err) {
                            throw new Error(err.message);
                        } else {
                            keyInfoList = data; // successful response
                        }
                        keyInfoList = keyInfoList.items.filter( item =>
                             item.enabled === bol
                        );

                        resolve(keyInfoList);
                    })
                } catch (err) {
                    throw new Error(err.message);
                }
            });
        }catch(err){
            throw new Error(err.message);
        }

    }

    //inputs single string, returns all key objects matching any part of the string
    async getApiKeysByPartialName(name ){
        try {
            return new Promise(async (resolve, reject) => {
                let params = {
                    includeValues: true //requests key itself is returned
                };
                try {
                    await this.apigateway.getApiKeys(params, function (err, data) {
                        let keyInfoList;

                        if (err) {
                            throw new Error(err.message);
                        } else {
                            keyInfoList = data; // successful response
                        }
                        keyInfoList = keyInfoList.items.filter( item => item.name.match(name + ""));

                        resolve(keyInfoList);
                    })
                } catch (err) {
                    throw new Error(err.message);
                }
            });
        }catch(err){
            throw new Error(err.message);
        }

    }


//inputs single string, returns all key objects matching the name according to aws apigateway search
    async getApiKeysByName(name) {
        try {
            return new Promise(async (resolve, reject) => {
                let params = {
                    nameQuery: name, //key id
                    includeValues: true //requests key itself is returned
                };
                try {
                    await this.apigateway.getApiKeys(params, function (err, data) {
                        let keyInfoList;

                        if (err) {
                            throw new Error(err.message);
                        } else {
                            keyInfoList = data; // successful response
                        }
                        resolve(keyInfoList);
                    })
                } catch (err) {
                    throw new Error(err.message);
                }
            });
        }catch(err){
            throw new Error(err.message);
        }
    }


    /*
        inputs a single keyId as string value, returns an api key as a String
     */
    async getApiKeyById(keyId) {
        try {
            return new Promise(async (resolve, reject) => {

                let params = {
                    apiKey: keyId, //key id
                    includeValue: true //requests key itself is returned
                };
                try {
                    await this.apigateway.getApiKey(params, function (err, data) {
                        let key;

                        if (err) {
                            throw new Error("something happened");
                        } else {
                            key = data.value; // successful response

                        }
                        resolve(key);
                    })
                } catch (err) {
                    throw new Error(err.message);
                }
            });
        }catch(err){
            throw new Error(err.message);
        }
    }

}

exports.UsagePlanManager = UsagePlanManager;