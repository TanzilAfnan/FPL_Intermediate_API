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
        console.log(currentGameWeek);

        ProcessRequest('fixtures/',  async (err,  fixtures) => {
            if (err) {
                res.send(err);
                return;
            }
            fixtures = JSON.parse(fixtures);

            let currentGameWeekFixture = await fixtures.filter(fixture => {
                return fixture.event == currentGameWeek.id
            });

            // let fixtureWithTeams = [];
            // await currentGameWeekFixture.forEach(async match=>{
            //
            //     let team_a = await getTeamNamesFromId(match.team_a);
            //     let team_h = await getTeamNamesFromId(match.team_h);
            //
            //     match.team_a = {
            //         "id": match.team_a,
            //         "name" : team_a
            //     };
            //
            //     match.team_h = {
            //         "id": match.team_h,
            //         "name" : team_h
            //     };
            //
            //     console.log("team_a", match.team_a);
            //     console.log("team_h", match.team_h);
            //
            //     fixtureWithTeams.push(match);
            //
            //     console.log(fixtureWithTeams);
            // });

            // console.log(currentGameWeekFixture);

            var fixtureWithTeams = await Promise.all( currentGameWeekFixture.map(async match => {
                let team_a = await getTeamNamesFromId(match.team_a);
                let team_h = await getTeamNamesFromId(match.team_h);

                match.team_a = {
                    "id": match.team_a,
                    "name" : team_a
                };

                match.team_h = {
                    "id": match.team_h,
                    "name" : team_h
                };

                console.log("team_a", match.team_a);
                console.log("team_h", match.team_h);

                return match;

            }));

            res.send(fixtureWithTeams);
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