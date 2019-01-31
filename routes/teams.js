const express = require('express');
const router = express.Router();
const ProcessRequest = require('./ProcessRequest');

const getTeamById = (id, cb) => {
    ProcessRequest('bootstrap-static' ,(err,  data) => {
        if(err){
            cb(err);
            return;
        }
        data = JSON.parse(data);
        let foundTeam = data.teams.find((team) => {
            return team.id == id;
        });
        cb( null, foundTeam);
    });
};

/*
 get all the fixtures
 returning an array of events objects
*/
router.get('/', (req, res, next) => {

    console.log("Teams :::");
    ProcessRequest('bootstrap-static' ,(err,  data) => {
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        data = JSON.parse(data);
        // console.log(data.teams);
        res.send(data.teams);
    });
});

/*
    get Team by id
*/
router.get('/:id', (req, res, next) => {
    id = req.params.id;

    getTeamById(id, (err, data)=> {
        if(err){
            console.log(err);
            return;
        }
        if(data === undefined){
            res.send({
                errorMessage: "invalid Team Id"
            });
        }
        res.send(data);
    });
});

module.exports = router;