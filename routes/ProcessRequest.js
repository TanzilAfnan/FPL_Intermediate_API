const express = require('express');
const router = express.Router();
const https = require('https');
const baseURL = require('../baseURL').baseUrl;

const ProcessRequest = (urlExt, cb) => {
    console.log("****************************");
    console.log(baseURL + urlExt);

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
            cb(null, data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        cb(err);
    });
};

module.exports = ProcessRequest;