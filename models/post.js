const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({  
    image:{
        type:String
    },
    caption:{
        type:String
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]
    // author:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // }
});

module.exports = mongoose.model("Post",postSchema);