const express = require('express');
const router = express.Router();
const ProcessRequest = require('./ProcessRequest');
const {fixture} =  require('open-fpl');

const getFixtureById = (id, cb) => {
    ProcessRequest('fixtures/')
        .then(data =>{
            data = JSON.parse(data);
            let foundFixture = data.find((fixture) => {
                return fixture.id == id;
            });
            cb( null, foundFixture);
        })
        .catch(err=> {
            cb(err);
        });


    // ProcessRequest('fixtures/' ,(err,  data) => {
    //     if(err){
    //         cb(err);
    //         return;
    //     }
    //     data = JSON.parse(data);
    //     let foundFixture = data.find((fixture) => {
    //         return fixture.id == id;
    //     });
    //     cb( null, foundFixture);
    // });
};

/*
 get all the fixtures
 returning an array of events objects
*/
router.get('/', (req, res, next) => {

    ProcessRequest('fixtures/')
        .then(data=>{
            res.send(data);
        })
        .catch(err=>{
            res.send(err);
        });
});


/*
    get fixture by id
*/
router.get('/:id', (req, res, next) => {
    id = req.params.id;

    getFixtureById(id, (err, data)=> {
        if(err){
            console.log(err);
            return;
        }
        if(data === undefined){
            res.send({
                errorMessage: "invalid Fixture Id"
            });
        }
        res.send(data);
    });
});

module.exports = router;