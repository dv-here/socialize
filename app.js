const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const port = 4444;
let posts = require('./models/post');
let Comments = require('./models/comment');
let User = require('./models/user');

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

// passport Configuration
app.use(require('express-session')({
    secret:"whatever it takes !!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user || null;
    next();
});
// let posts = [
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption1",creator:"user1"},
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption2",creator:"user2"},
//     {image:"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1008&q=80",caption:"Caption3",creator:"user3"}, 
// ]


// routes
app.get('/',(req,res)=>{
    res.send("hello there....");
});

app.get('/home',(req,res)=>{
    // console.log(req.user.username);
    // get all posts of all the followers of the logged user from db
    User.findOne({username:req.user.username}).populate({
        path:'following',
        model:'User',
        populate:{
            path:'posts',
            model:'Post',
            options:{sort:{'date':-1}},
            populate:{
                path:'author',
                model:'User'
            }
        }
        }).exec((err,user)=>{
        if(err) throw err;
        else{
            res.render("home",{followings:user.following});
        }
    });
})

app.post("/home",isUserLogged,(req,res)=>{
    // get data from form
    let image = req.body.image;
    let caption = req.body.caption;
    let author = req.user
    let newpost = {image:image,caption:caption,author:author,date:Date.now()};

    // create a new post and save it to db
    posts.create(newpost,(err,post)=>{
        if(err) throw err;
        else{
            author.posts.push(post);
            author.save();
            // redirect to the posts page
            res.redirect('/home');
        }
    });
});

// route to create new post
app.get('/post/new',isUserLogged,(req,res)=>{
    res.render("newPost");
});

// post show route
app.get('/post/:id',(req,res)=>{
    // find the post with the id
    let post_id = req.params.id
    
    posts.findById(post_id).populate('comments').populate('author').exec((err,found_post)=>{
        if(err) throw err;
        else{
            // render that post page
            res.render('post',{post:found_post});
        }
    })
    
});

app.post('/home#:id',isUserLogged,(req,res)=>{

    posts.findById(req.params.id,(err,post)=>{
        console.log(post);
        post.likes.push(req.user);
        post.save(err=>{
            if(err) throw err;
            else{
                res.render('/home#'+post._id);
            }
        })

    });

});

// create comment route
app.post('/post/:id',isUserLogged,(req,res)=>{
    // search for id
    let id = req.params.id;
    posts.findById(id,(err,post)=>{
        if(err) throw err;
        else{
            let comment = {commentator:req.user.name,username:req.user.username,comment:req.body.comment,date:Date.now()};
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

// Authenticaion routes
function isUserLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login'); 
}

// show the signup form
app.get('/register',(req,res)=>{
    res.render('signup');
})

// signup logic
app.post('/register',(req,res)=>{
    let newUser = new User({name:req.body.name ,email:req.body.email ,username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.render("signup");
        }
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/home');
        })
    })
});

// show the login form
app.get('/login',(req,res)=>{
    res.render('login');
});

// login logic
app.post('/login', passport.authenticate("local",{successRedirect:'/home',failureRedirect:'/login'}) ,(req,res)=>{
});

// logout logic
app.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})

// profile route
app.get('/profile/:username',(req,res)=>{
    let username = req.params.username;
    User.findOne({username:username}).populate(
        [
            {path:'posts',
            model:'Post'},
            {path:'followers',
            model:'User'},
            {path:'following',
            model:'User'},
            
        ]
        ).exec((err,found_user)=>{
        if(err) throw err;
        else{
            
            User.findOne({username:req.user.username},(err,user)=>{
                if(err) throw err;
                else{
                    
                    let followings = user.following;
                    let has_followed = false;
                    for(let i=0;i<followings.length;i++){
                        if(found_user._id.equals(followings[i])){
                            has_followed = true;
                            break;
                        }
                    }
                    // console.log("has_followed:",has_followed);
                    
                    res.render('profile',{user:found_user,has_followed:has_followed,followers:found_user.followers,followings:found_user.following});
                }
            });

        }
    });
});

// route to follow a user
app.post('/profile/:username/follow',(req,res)=>{
   
    // find user by username(user to be followed)
    User.findOne({username:req.params.username},(err,user_to_be_followed)=>{
        if(err) throw err;
        else{
            user_to_be_followed.followers.push(req.user._id);
            user_to_be_followed.save((err)=>{
                if(err) throw err;
                else{
                
                User.findOne(req.user,(err,user)=>{
                    if(err) throw err;
                    else{
                        user.following.push(user_to_be_followed._id);
                        user.save();
                        // console.log("user_to_",user_to_be_followed); 
                        res.redirect('/profile/'+req.params.username);
                    }
                });
                }
            });
        }

    });
    
});

// route to unfollow a user
app.post('/profile/:username/unfollow',(req,res)=>{

    // find the user to be unfollowed
    User.findOne({username:req.params.username},(err,user_to_be_Unfollowed)=>{
        if(err) throw err;
        else{
            // unfollow that user
            for(let i=0;i<user_to_be_Unfollowed.followers.length;i++){
                if(req.user._id.equals(user_to_be_Unfollowed.followers[i]._id)){
                    user_to_be_Unfollowed.followers.splice(i,1);
                }
            }
            
            console.log(user_to_be_Unfollowed);
            // save it to the db
            user_to_be_Unfollowed.save(err=>{
                if(err) throw err;
                else{
                    User.findOne({username:req.user.username},(err,user)=>{
                        if(err) throw err;
                        else{
                            for (let i = 0; i < user.following.length; i++) {
                                if(user_to_be_Unfollowed._id.equals(user.following[i])){
                                    user.following.splice(i,1);
                                }
                                
                            }
                            user.save(err=>{
                                if(err) throw err;
                                else{
                                }
                                res.redirect('/profile/'+req.params.username);
                            });
                        }
                    });
                }
            });
            
            // res.redirect('/profile/'+req.params.username);
        }
    });

});


app.listen(port,()=>{
    console.log(`Server listening @ http://localhost:${port}`);
})