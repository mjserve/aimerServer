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

router.get('/:postId_1/:postId_2', async (req, res) => {
    console.log('In comparison GET...');
    
    try
    {
        const workSession_1 = await WorkSession.findById(req.params.postId_1);
        const workSession_2 = await WorkSession.findById(req.params.postId_2);

        var firstDate = new Date(workSession_1.date);
        var secondDate = new Date(workSession_2.date);

        var firstSession;
        var secondSession;

        //Compare dates of the 2 sessions to be compared and make the earlier of the two come first
        //when returning data
        if (firstDate > secondDate)
        {
            firstSession = workSession_2;
            secondSession = workSession_1;
        }
        else
        {
            firstSession = workSession_1;
            secondSession = workSession_2;
        }

        //Find common scenarios among the 2 sessions and create object to respond with
        var result = {
            sharedScenarios : []
        };

        for(var i=0; i < firstSession.scenarioList.length; i++)
        {
            for(var j=0; j < secondSession.scenarioList.length; j++)
            {
                if (firstSession.scenarioList[i].scenario_name == secondSession.scenarioList[j].scenario_name)
                {
                    var bothSessions = {
                        name : firstSession.scenarioList[i].scenario_name,
                        score_1 : firstSession.scenarioList[i].score,
                        time_1 : firstSession.scenarioList[i].timePlayed,
                        score_2: secondSession.scenarioList[j].score,
                        time_2 : secondSession.scenarioList[j].timePlayed
                    };

                    result.sharedScenarios.push(bothSessions);
                }
            }
        }

        res.json(result);
    }
    catch(err)
    {
        res.json({msg : err});
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