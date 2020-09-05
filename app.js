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

// creating database connection
mongoose.connect("mongodb://localhost/socializeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// let posts = [
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption1",creator:"user1"},
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption2",creator:"user2"},
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption3",creator:"user3"}, 
// ]

let posts = require('./models/post');
let Comments = require('./models/comment');

app.get('/',(req,res)=>{
    res.send("hello there....");
});

app.get('/posts',(req,res)=>{
    // get all posts from db
    posts.find({},(err,allposts)=>{
        if(err)throw err;
        else{
            res.render("home",{posts:allposts});
        }
    });
})

app.post("/posts",(req,res)=>{
    // get data from form
    let image = req.body.image;
    let caption = req.body.caption;
    let newpost = {image:image,caption:caption,creator:"user"};
    // create a new post and save it to db
    posts.create(newpost,(err,post)=>{
        if(err) throw err;
        else{
            // redirect to the posts page
            res.redirect('/posts');
        }
    })
});

// route to create new post
app.get('/post/new',(req,res)=>{
    res.render("newPost");
});

//
app.get('/post/:id',(req,res)=>{
    // find the post with the id
    let post_id = req.params.id
    
    posts.findById(post_id).populate('comments').exec((err,found_post)=>{
        if(err) throw err;
        else{
            // render that post page
            res.render('post',{post:found_post});
        }
    })
    
});

app.post('/post/:id',(req,res)=>{
    // search for id
    let id = req.params.id;
    posts.findById(id,(err,post)=>{
        if(err) throw err;
        else{
            let comment = {commentator:req.body.name,comment:req.body.comment};
            Comments.create(comment,(err,comment)=>{
                if(err) throw err;
                else{
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/post/'+id+'#comments');
                }
            });
        }
    });
});

app.listen(port,()=>{
    console.log(`Server listening @ http://localhost:${port}`);
})