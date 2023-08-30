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


test('found enabled keys' , async () =>{
    const data = await gate.getApiKeysByEnabled(true);
    expect(data[0].enabled).toBe(true);
})