const express = require('express');
const router = express.Router();
const ProcessRequest = require('./ProcessRequest');

/*
    returns a promise that contains the gameweek with the corresponding
    Fixture and teams for the given game week in the parameter
 */
const getFixtureWithTeams = async (gameWeekId) => {
    return new Promise((sol, rej) => {
        ProcessRequest('fixtures/',  async (err,  fixtures) => {
        if (err) {
            rej(err);
            console.log(err);
            return;
        }
        fixtures = JSON.parse(fixtures);

        //Just getting the fixture that matches with the given gameweek Id
        let thisGameWeekFixture = await fixtures.filter(fixture => {
            return fixture.event == gameWeekId
        });

        /*
            promise.all because all the promises need to be completed
            before the array is assigned in the array.map function assigns the
            values to the array.
        */
        let fixtureWithTeams = await Promise.all(
            thisGameWeekFixture.map(async match => {
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

            return match;
        }));

        sol(fixtureWithTeams);
    });
    });
};

/*
 get all the events
 returning an array of events objects

 Todo: map the fixture for all the gameweeks

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
    get the current week gameweek details:
    includes the match fixture for the current gameweek
    and also the teams.
*/
router.get('/current', (req, res, next) => {

    ProcessRequest('bootstrap', async (err,  data) => {
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

        getFixtureWithTeams(currentGameWeek.id)
            .then(fixtureWithTeams => {
                console.log(fixtureWithTeams);

                    let current = {
                        "gameweek" : currentGameWeek.id,
                        "fixture" : fixtureWithTeams
                    };

                    res.send(current);
            })
            .catch(err => {
               console.log(err);
            });
    });
});

/*
    get a game week by id:
    includes the match fixture for the required gameweek
    and also the teams.
*/
router.get('/:id', (req, res, next) => {
    id = req.params.id;
    console.log(" ID : " , id);

    getFixtureWithTeams(id)
        .then(fixtureWithTeams => {
            console.log(fixtureWithTeams);

            let current = {
                "gameweek" : id,
                "fixture" : fixtureWithTeams
            };

            res.send(current);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;