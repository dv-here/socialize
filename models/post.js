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
    }],
    likeCount:{
        type:Number,
        default:0
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    date:Date
});

module.exports = mongoose.model("Post",postSchema);