const { UsagePlanManager } = require("../lib/UsagePlanManager");
const gate = new UsagePlanManager();
const exampleKeyObject = {
    "id": 'STRING',               //api key id
    "value": 'STRING',            //api key
    "name": 'STRING',             // name of key
    "enabled": true,         //is key enabled?
    "createdDate": 'STRING',      //Time stamp of key "2023-02-08T05:29:47.000"
    "lastUpdatedDate": 'STRING',  //Time stamp of key
    "stageKeys": []               //A list of Stage resources that are associated with the ApiKey resource.
}


const existingKeyObject  = {
    "id": "nughmn2urh",
    "name": "newKey2",
    "enabled": true,
    "createdDate": "2023-02-18T17:18:39-06:00",
    "lastUpdatedDate": "2023-02-18T17:18:39-06:00",
    "stageKeys": []
}

test('find enabled keys' , async () =>{
    const data = await gate.getApiKeysByEnabled(true);
    expect(data[0].enabled).toBe(true);
})

//This could fail on a new account
test('find keys by partial name' , async () =>{
    const data = await gate.getApiKeyObjectsByPartialName(existingKeyObject.name);
    expect(data[0].name).toEqual(expect.stringMatching(existingKeyObject.name));
})


//This could fail on a new account
test('find keys by full name' , async () =>{
    const data = await gate.getApiKeyObjectsByName(existingKeyObject.name);
    expect(data[0].name).toEqual(existingKeyObject.name);
})

//This could fail on a new account
test('find keys by id' , async () =>{
    const data = await gate.getApiKeyById(existingKeyObject.id);
    expect(data.id).toEqual(existingKeyObject.id);
})

