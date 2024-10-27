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
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', async (req, res) => {
    delete req.headers.host
    delete req.headers.referer
    const API_URL = process.env.MIMOTO_HOST;
    const path = req.url
    try {
        let response = {};
        if(path.indexOf("download") !== -1 ) {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' to specific origin if needed
            res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST'); // Allow GET requests
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

            response = await axios({
                method: req.method,
                responseType: "arraybuffer",
                url: `${API_URL}/v1/mimoto/credentials/download`,
                data: new URLSearchParams(req.body),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Accept": 'application/pdf',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
            res.set("Content-Type", "application/pdf");
            res.status(response.status).send(response.data);
        } else {
            response = await axios({
                method: req.method,
                url: `${API_URL}${path}`,
                headers: req.headers,
                data: new URLSearchParams(req.body)
            });
            res.status(response.status).json(response.data);
        }

    } catch (error) {
        console.error("Error occurred: ", error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
