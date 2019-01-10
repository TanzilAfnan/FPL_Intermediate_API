var express = require('express');
var router = express.Router();
const https = require('https');

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', {title: 'Express'});

    https.get('https://fantasy.premierleague.com/drf/bootstrap-static', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // console.log(JSON.parse(data));
            res.send(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

module.exports = router;
