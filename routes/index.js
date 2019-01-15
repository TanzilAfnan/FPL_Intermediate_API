const express = require('express');
const router = express.Router();
const https = require('https');
const baseURL = "https://fantasy.premierleague.com/drf/";

const ProcessRequest = (urlExt ,cb) => {
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

/* GET home page. */
router.get('/*', function (req, res, next) {

    console.log(req.url);
    let url = req.url;
    if(url === '/') {
        url = '/bootstrap-static';
    }
    url = url.substring(1);
    console.log("URL : ", url);

    if(!url.endsWith('/')){
        url += '/';
    }

    let rest = url.split("/");
    console.log(rest);
    ProcessRequest(url, (err, data)=>{
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        res.send(data);
    });
});


module.exports = router;
