const  UsagePlanManager  = require("../lib/index.js");
let planManagerConfig = { 
    region: 'us-east-1'
}

const gate = new UsagePlanManager(planManagerConfig);


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

test('find keys by partial name' , async () =>{
    const data = await gate.getApiKeyObjectsByPartialName(existingKeyObject.name);
    expect(data[0].name).toEqual(expect.stringMatching(existingKeyObject.name));
})


test('find keys by full name' , async () =>{
    const data = await gate.getApiKeyObjectsByName(existingKeyObject.name);
    expect(data[0].name).toEqual(existingKeyObject.name);
})

test('find keys by id' , async () =>{
    const data = await gate.getApiKeyById(existingKeyObject.id);
    expect(data.id).toEqual(existingKeyObject.id);
})

