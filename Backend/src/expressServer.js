const express = require('express')
const { UsagePlanManager } = require("../core/UsagePlanManager");
const app = express()
const port = 3000

const gate = new UsagePlanManager();
app.use(express.json()) 

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/apikey', async (req, res) => {
    let key;
    await gate.getApiKeyById(req.query.keyId).then(
        response => {
            key = response;
            res.status(200);
            res.type('application/json')
            res.send({
                statusCode: 200,
                apiKey: key
            });
        }).catch(err => {
            res.status(500);
            res.type('application/json')
            res.send({
                statusCode: 500,
                message: err.message
            });
        });
    
});
app.get('/apikey/byString', async (req, res) => {
        await gate.getApiKeyObjectsByName(req.query.name).then(
            response => {
                res.status(200);
                res.type('application/json')
                res.send({
                    statusCode: 200,
                    apiKeyObjects: response
                });
            }).catch(err => {
                res.status(500);
                res.type('application/json')
                res.send({
                    statusCode: 500,
                    message: err.message
                });
            });   
})

app.get('/apikey/byStringPart', async (req, res) => {
        await gate.getApiKeyObjectsByPartialName(req.query.name).then(
            response => {
                res.status(200);
                res.type('application/json')
                res.send({
                    statusCode: 200,
                    apiKeyObjects: response
                });
            }).catch(err =>{
                res.status(500);
                res.type('application/json')
                res.send({
                    statusCode: 500,
                    message: err.message
                });
            })
})

app.get('/apikey/byEnabled', async (req, res) => {
        await gate.getApiKeysByEnabled(req.query.isEnabled === 'true').then(
            response => {
                res.status(200);
                res.type('application/json')
                res.send({
                    statusCode: 200,
                    apiKeyObjects: response
                });
            }).catch(err => {
                res.status(500);
                res.type('application/json')
                res.send({
                    statusCode: 500,
                    message: err.message
                });
            });
})

app.post('/apikey/create', async (req, res) => {
    await gate.createApiKeyByName(req.body.keyName ).then(
        response => {
            res.status(200);
            res.type('application/json')
            res.send({
                statusCode: 200,
                apiKeyObjects: response
            });
        }).catch(err => {
            res.status(500);
            res.type('application/json')
            res.send({
                statusCode: 500,
                message: err.message
            });
        });
})

app.post('/apikey/create/params', async (req, res) => {
    await gate.createApiKeyByParams(req.body ).then(
        response => {
            res.status(200);
            res.type('application/json')
            res.send({
                statusCode: 200,
                apiKeyObjects: response
            });
        }).catch(err => {
            res.status(500);
            res.type('application/json')
            res.send({
                statusCode: 500,
                message: err.message
            });
        });
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})