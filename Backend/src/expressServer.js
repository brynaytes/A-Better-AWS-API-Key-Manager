const express = require('express')
const {UsagePlanManager} = require("../core/UsagePlanManager");
const app = express()
const port = 3000

const gate = new UsagePlanManager();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/apikey', async (req, res) => {
    let key;
    try {
        await gate.getApiKeyById(req.query.keyId).then(
            response => {
                key = response
            });

    }catch(err){
        res.status(500);
        res.type('application/json')
        res.send({
            statusCode: 500,
            message: err.message
        });
    }
    res.status(200);
    res.type('application/json')
    res.send({
        statusCode: 200,
        apiKey: key
    });
})
app.get('/apikey/byString', async (req, res) => {
    let keyInfoList;
    try {
        await gate.getApiKeysByName(req.query.name).then(
            response => {
                keyInfoList = response
            });

    }catch(err){
        res.status(500);
        res.type('application/json')
        res.send({
            statusCode: 500,
            message: err.message
        });
    }
    res.status(200);
    res.type('application/json')
    res.send({
        statusCode: 200,
        apiKey: keyInfoList
    });
})

app.get('/apikey/byStringPart', async (req, res) => {
    let keyInfoList;
    try {
        await gate.getApiKeysByPartialName(req.query.name).then(
            response => {
                keyInfoList = response
            });

    }catch(err){
        res.status(500);
        res.type('application/json')
        res.send({
            statusCode: 500,
            message: err.message
        });
    }
    res.status(200);
    res.type('application/json')
    res.send({
        statusCode: 200,
        apiKey: keyInfoList
    });
})

app.get('/apikey/byEnabled', async (req, res) => {
    let keyInfoList;
    try {
        await gate.getApiKeysByEnabled(req.query.isEnabled === 'true').then(
            response => {
                keyInfoList = response
            });

    }catch(err){
        res.status(500);
        res.type('application/json')
        res.send({
            statusCode: 500,
            message: err.message
        });
    }
    res.status(200);
    res.type('application/json')
    res.send({
        statusCode: 200,
        apiKey: keyInfoList
    });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})