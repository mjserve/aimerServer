const express = require('express');
const router = express.Router();
const WorkSession = require('../models/WorkSession');
const ScenarioType = require('../models/ScenarioType');
const Sesh = require('../lib/sesh');

 //PURELY for testing. Delete eventually
 router.get('/testing', async (req, res) => {
    console.log('In GET ../workSessions/testing');
   try
   {
    let counter = 0;
    const workSessions = await WorkSession.find();
    workSessions.map(session => {
        for(var i=0;i < session.scenarioList.length; i++)
        {
            if(session.scenarioList[i].scenario_name == 'Tile Frenzy 180 Strafing Tracking')
            {
                counter++;
                var score = session.scenarioList[i].score;
                var testRegexCount = /Kill Count.+[Aa]/;

                var kCountMatch = score.match(testRegexCount);

                var testRegexPer = /A.+%/;

                var percentageMatch = score.match(testRegexPer);
                
                if(kCountMatch != null)
                {
                    var cleanKCount = kCountMatch[0].replace(/[a-zA-Z]/g, '');
                    cleanKCount = cleanKCount.replace(/,/g, '');
                    cleanKCount = cleanKCount.replace(/:/g, '');
                    cleanKCount = cleanKCount.trim();

                    var cleanPercentage = percentageMatch[0];
                    var cleanPercentage = percentageMatch[0].replace(/[a-zA-Z]/g, '');
                    cleanPercentage = cleanPercentage.replace(/:/g, '');
                    cleanPercentage = cleanPercentage.replace(/%/g, '');
                    cleanPercentage = cleanPercentage.trim();

                    var ans = cleanKCount + '(' + cleanPercentage + ')';
                    console.log('Final: ' + ans);
                    console.log('id: ' + session._id);

                    let finalArr = [];
                    console.log(session.scenarioList.length);
                    
                    console.log(finalArr);
                }
            }
        }
    });

    console.log('Num of TF180ST: ' + counter);

    res.json({msg : 'good'});
   }
   catch (err)
   {
       res.json({ msg : err});
   }
});

/*
In progress for testing high scores
*/ 
router.get('/highs', async (req, res) => {
    console.log('In GET ../workSessions/highs');
   try
   {
       let highScoreList = [];
       var tempSingleScenarioHigh = {};
       const scenarioTypes = await ScenarioType.find();
       const workSessions = await WorkSession.find();

       scenarioTypes.map(scenario => {
           console.log(scenario);
           tempSingleScenarioHigh = Sesh.calculateHigh(scenario.name, workSessions);
           highScoreList.push(tempSingleScenarioHigh);
       });

       console.log('PRINT HIGHS: ');
       console.log(highScoreList);
       highScoreList.map(score => {
           console.log(score);
       });
       
       res.json(highScoreList);

     
   }
   catch (err)
   {
       res.json({ msg : err});
   }
});

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
    console.log('In worksessions.post add new WorkSession');
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