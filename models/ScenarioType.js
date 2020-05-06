const mongoose = require('mongoose');

const ScenarioTypeSchema = mongoose.Schema({
    name: {
        type: String
    }
});

module.exports = mongoose.model('ScenarioTypes', ScenarioTypeSchema);