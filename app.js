const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const port = 4444;

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
//view engine setup
app.set('views',path.join(__dirname,"views"));
app.set('view engine','ejs');



app.get('/',(req,res)=>{
    res.send("hello there....");
});











app.listen(port,()=>{
    console.log(`Server listening @ http://localhost:${port}`);
})