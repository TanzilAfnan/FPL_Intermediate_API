// const express = require('express');
// const router = express.Router();
const https = require('https');
const baseURL = require('../baseURL').baseUrl;

const ProcessRequest = (urlExt) => {
    // console.log("****************************");
    // console.log(baseURL + urlExt);
    return new Promise((sol, rej) => {
        https.get(baseURL + urlExt, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                // console.log(JSON.parse(data));
                // res.send(data);
                // cb(null, data);
                sol(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            // cb(err);
            rej(err);
        });
    });
};

module.exports = ProcessRequest;