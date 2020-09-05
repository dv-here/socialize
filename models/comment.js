const mongoose = require('mongoose');

let commentModel = new mongoose.Schema({
    commentator:String,
    email:String,
    comment:String
});

module.exports = mongoose.model('Comment',commentModel);