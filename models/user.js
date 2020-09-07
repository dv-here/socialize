const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema
let userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:String,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    following:[
        {
            
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            
        }
    ],
    followers:[
        {
            
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                
            
        }
    ]
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);