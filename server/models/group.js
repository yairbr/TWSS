var mongoose = require('mongoose');

var groupScheme = mongoose.Schema({
    _id : String,
    users : [String]
});

module.exports = mongoose.model('Group', groupScheme);