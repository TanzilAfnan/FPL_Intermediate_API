const express = require('express');
const router = express.Router();
const https = require('https');
const baseURL = require('../baseURL').baseUrl;

const ProcessRequest = (urlExt, cb) => {
    console.log("****************************");
    console.log(baseURL + 'events/');

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

const getgameWeekById = (id, cb) => {
    ProcessRequest('events/' ,(err,  data) => {
        if(err){
            cb(err);
            return;
        }
        data = JSON.parse(data);
        let foundEvent = data.find((event) => {

            return event.id == id;
        });
        cb( null, foundEvent);
    });
};

const getTeamNamesFromId = (id) => {
    return new Promise ((resolve, reject)=> {
        ProcessRequest('teams/', (err, teams) => {
            if (err) {
                reject(err);
                return;
            }
            teams = JSON.parse(teams);
            let foundTeam = teams.find((team) => {

                return team.id == id;
            });
            resolve(foundTeam.name);
        })
    });
};

/*
 get all the events
 returning an array of events objects
*/
router.get('/', (req, res, next) => {
    ProcessRequest('events/' ,(err,  data) => {
        if(err){
            // console.log(err);
            res.send(err);
            return;
        }
        res.send(data);
    });
});

/*
    get the current week game evet details
*/
router.get('/current', (req, res, next) => {

    let currentGameWeek = {};

    ProcessRequest('events/',  (err,  events) => {
        if(err){
            res.send(err);
            return;
        }
        events = JSON.parse(events);
        let currentGameWeek = events.find((event) => {
            return event.is_current === true;
        });

        ProcessRequest('fixtures/',  async (err,  events) => {
            if (err) {
                res.send(err);
                return;
            }
            events = JSON.parse(events);
            let currentGameWeekFixture = events.find((event) => {
                return event.id == currentGameWeek.id;
            });

            let team_a = await getTeamNamesFromId(currentGameWeekFixture.team_a);
            let team_h = await getTeamNamesFromId(currentGameWeekFixture.team_h);
            //
            // console.log("team_a", team_a);
            // console.log("team_h", team_h);
            currentGameWeekFixture.team_a = team_a;
            currentGameWeekFixture.team_h = team_h;

            currentGameWeek.fixture = currentGameWeekFixture;
            res.send(currentGameWeek);
        });

    });
});

/*
    get an event with event id
*/
router.get('/:id', (req, res, next) => {
    id = req.params.id;
    console.log(" ID : " , id);
    getgameWeekById(id, (err, data) =>{
        if(err){
            res.send(err);
            return;
        }
        console.log(data);
        if(data === undefined){
            res.send({
                errorMessage: "invalid Gameweek Id"
            });
        }
        res.send(data);
    })
});



module.exports = router;