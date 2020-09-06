const mongoose = require('mongoose');

let commentModel = new mongoose.Schema({
    commentator:String,
    username:String,
    comment:String,
    date:Date
});

module.exports = mongoose.model('Comment',commentModel);