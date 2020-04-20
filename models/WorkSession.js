const mongoose = require('mongoose');

const WorkSessionSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    scenarioList: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('WorkSessions', WorkSessionSchema);
