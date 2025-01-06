const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('*', async (req, res) => {
    delete req.headers.host
    delete req.headers.referer

    let targetHost;
    switch (req.headers['target-server']) {
        case 'oauth':
            targetHost = req.headers['target-host'];
            break;
        default:
            targetHost = process.env['MIMOTO_HOST'];
    }
    delete req.headers['target-server'];
    delete req.headers['target-host'];
    const path = req.url;

    try {

        let response = await axios({
            method: req.method,
            responseType:
                path.indexOf("/download") === -1 ? "json" : "arraybuffer",
            url: `${targetHost + path}`,
            data: new URLSearchParams(req.body),
            headers: req.headers
        });

        if (path.indexOf("/download") === -1) {
            res.status(response.status).json(response.data);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to specific origin if needed
            res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST'); // Allow GET requests
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
            res.set("Content-Type", "application/pdf");
            res.status(response.status).send(response.data);
        }

    } catch (error) {
        console.error("Error occurred: ", error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({error: error.message});
        }
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
