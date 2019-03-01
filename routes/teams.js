const express = require('express');
const router = express.Router();
const ProcessRequest = require('./ProcessRequest');
const {teams} =  require('open-fpl');

const getTeamById = async (id, cb) => {
    try {
        let data = await ProcessRequest('bootstrap-static');
        data = JSON.parse(data);

        let requiredTeam = await data.teams.filter(team => {
            return team.id == id;
        });
        console.log(requiredTeam);
        cb(null, requiredTeam[0]);
    }
    catch(err){
        console.log(err);
        cb(err);
    }
};

/*
 get all the fixtures
 returning an array of events objects
*/
router.get('/', async (req, res, next) => {

    teams.GetAllTeams((err, data) => {
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        console.log(data);
        res.send(data);
    });
});

/*
    get Team by id
*/
router.get('/:param', (req, res, next) => {

    console.log("Here!!!!");
    const param = req.params.param;

    console.log(isNaN(param));

    // if true , it means parameter is a string
    if(isNaN(param)){

        console.log("inside If ");
        teams.GetTeamByName(param, (err, data)=> {
            if(err){
                console.log("Err" , err);
                return;
            }
            if(data === undefined){
                res.send({
                    errorMessage: "invalid Team Name"
                });
            }
            console.log("teams.GetTeamByName : ", data);
            res.send(data);
        });
        return;
    }
    else{
        teams.GetTeamById(param, (err, data)=> {
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
    }
});

module.exports = router;