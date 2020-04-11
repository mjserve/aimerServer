const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Import Routes
const postsRoute = require('./routes/posts');
const exercisesRoute = require('./routes/exercises');

//MIDDLEWARE
app.use('/posts', postsRoute);
app.use('/exercises', exercisesRoute);

//Connect to db
mongoose.connect('mongodb://mod:admin55!@ds221416.mlab.com:21416/aimer',
     {useNewUrlParser : true, 
      useUnifiedTopology: true },
      ()=>{
    console.log('Connected to DB!');
});

//ROUTES
app.get('/', (req, res) => {
    res.send('we are on home');
})

/*
app.post('/quotes', (req, res) => {
    console.log('Helllloo');
    console.log(req.body);
    res.redirect('/');
})
*/

app.listen(5000, function() {
    console.log('listening on port 5000');
    console.log(__dirname);
})