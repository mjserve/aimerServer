const express = require('express');
const router = express.Router();
const WorkSession = require('../models/WorkSession');

//gets all posts 
router.get('/', async (req, res) => {
   try
   {
       const exercises = await WorkSession.find();
       res.json(exercises);
   }
   catch (err)
   {
       res.json({ msg : err});
   }
});

//Submits a post
router.post('/',  async (req, res) => {
   const workSession = new workSession({
       exerciseList : req.body.exerciseList
   });

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
router.get('/:exerciseId', async (req, res) => {
   try
   {
       const exercise = await WorkSession.findById(req.params.exerciseId);
       res.json(exercise);
   }
   catch(err)
   {
       res.json({ msg : err});
   }
});

//Delete post
router.delete('/:exerciseId', async (req, res) => {
   try
   {
       const removedExercise = await WorkSession.remove({_id : req.params.exerciseId});
       res.json(removedExercise);
   }
   catch(err)
   {
       res.json({msg : err});
   }
});

//Update a post
router.patch('/:exerciseId', async (req, res) => {
   try
   {
       const updatedExercise = await WorkSession.updateOne(
           {_id : req.params.exerciseId}, 
           {$set : {name: req.body.name}}
       );
       res.json(updatedExercise);
   }
   catch(err)
   {
       res.json(err);
   }
});

module.exports = router;