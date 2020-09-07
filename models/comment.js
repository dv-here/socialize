const mongoose = require('mongoose');
const moment = require('moment');
let commentModel = new mongoose.Schema({
    commentator:String,
    username:String,
    comment:String,
    date:{
        type:String
    }
});

module.exports = mongoose.model('Comment',commentModel);