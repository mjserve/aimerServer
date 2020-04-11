const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    timePlayed: {
        type: String,
        required: true
    }
});

const WorkSessionSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    exerciseList: [ExerciseSchema]
});

module.exports = mongoose.model('WorkSessions', WorkSessionSchema);