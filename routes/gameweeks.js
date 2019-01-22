const express = require('express');
const router = express.Router();
// const https = require('https');
// const baseURL = require('../baseURL').baseUrl;
const ProcessRequest = require('./ProcessRequest');

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

    console.log();

    ProcessRequest('bootstrap',  (err,  data) => {
        if(err){
            res.send(err);
            return;
        }

        data = JSON.parse(data);
        const currentGameWeekId = data["current-event"];
        let events = data.events;

        let currentGameWeek = events.find((event) => {
            return event.id === currentGameWeekId;
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


            /*
                promise.all because all the promises need to be completed
                before the array is assigned in the array.map function assigns the
                values to the array.
            */
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

            let current = {
                "gameweek" : currentGameWeek.id,
                "fixture" : fixtureWithTeams
            };

            res.send(current);
        });

    });
});

/*
    get an event with event id
*/
router.get('/byid/:id', (req, res, next) => {
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