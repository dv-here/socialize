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

let posts = [
    {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption1",creator:"user1"},
    {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption2",creator:"user2"},
    {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption3",creator:"user3"}, 
]


app.get('/',(req,res)=>{
    res.send("hello there....");
});

app.get('/posts',(req,res)=>{
    
    res.render("home",{posts:posts});
})

app.post("/posts",(req,res)=>{
    // get data from form
    let image = req.body.image;
    let caption = req.body.caption;
    let newpost = {image:image,caption:caption,creator:"user"};
    console.log(newpost);
    posts.push(newpost);
    // redirect to the posts page
    res.redirect('/posts');
});

app.get('/post/new',(req,res)=>{
    res.render("newPost");
});



app.listen(port,()=>{
    console.log(`Server listening @ http://localhost:${port}`);
})