const express = require('express');
const router = express.Router();
const WorkSession = require('../models/WorkSession');

 //gets all posts 
 router.get('/', async (req, res) => {
     console.log('In GET ../workSessions');
    try
    {
        const workSessions = await WorkSession.find();
        console.log(workSessions);
        res.json(workSessions);
    }
    catch (err)
    {
        res.json({ msg : err});
    }
});

//Submits a post
router.post('/',  async (req, res) => {
    console.log(req.body);
    const workSession = new WorkSession();

    try
    {
        const savedWorkSession = await workSession.save();
        res.json(savedWorkSession);
    } 
    catch (err)
    {
        res.json({ msg : err});
    }
});

//Specific post
router.get('/:postId', async (req, res) => {
    console.log('In GET');
    try
    {
        const workSession = await WorkSession.findById(req.params.postId);
        res.json(workSession);
    }
    catch(err)
    {
        res.json({ msg : err});
    }
});

//Delete post
router.delete('/:postId', async (req, res) => {
    try
    {
        const removedWorkSession = await WorkSession.remove({_id : req.params.postId});
        res.json(removedWorkSession);
    }
    catch(err)
    {
        res.json({msg : err});
    }
});

//Update a post
router.patch('/:postId', async (req, res) => {
    console.log('Am hitting here!!!!');
    console.log("in PATCH: " + req.body.postId );
    try
    {    let scenario = {
            scenario_name : req.body.scenario_name,
            score : req.body.score,
            timePlayed : req.body.timePlayed
        }; 

        console.log('Updating...');
        console.log('Updating...');
        console.log('Updating...');
        console.log(scenario);

        const pushScenarioPost = await WorkSession.findOneAndUpdate(
            {_id: req.params.postId},
            {$addToSet: {scenarioList : scenario}},
            (error, success) => {
                if (error){
                    console.log(error);
                }
                else{
                    console.log(success);
                }
            }
        )
        console.log(pushScenarioPost);
        res.json(pushScenarioPost);
    }
    catch(err)
    {
        res.json(err);
    }
});

module.exports = router;