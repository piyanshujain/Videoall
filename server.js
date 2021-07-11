const express = require('express'),
      app     = express(),
      server  = require('http').Server(app);
      const io = require('socket.io')(server);
      const { ExpressPeerServer } = require('peer');
      const peerServer = ExpressPeerServer(server , {
        debug: true
      }) 
      const mongoose        = require("mongoose"),
      LocalStrategy         = require("passport-local"),
      bodyParser            = require("body-parser"),
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSanitizer      = require("express-sanitizer"),
      Room                  = require("./models/room-model"),
      User                  = require("./models/user"),
      Chat               = require("./models/chat"),
      catchAsync = require('./utils/catchAsync'),
      passport              = require('passport');
      const flash = require('connect-flash');
      const {v4 : uuidv4} = require('uuid');

  mongoose.connect("mongodb+srv://Piyanshu:12348765@video-call-app.otsmf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));
    app.use(flash());
    app.use(require("express-session")({
      secret: "Teams-Clone-App",
      resave: false,
      saveUninitialized: false
  }));
  app.use(function(req, res, next){
  //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });
  mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.use('/peerjs' , peerServer);

app.get('/', function(req,res){
  var flag=0;
  var username="Guest-User"
  if(req.user){
    flag=1;
    username=req.user.username;
  }
  var id=uuidv4();
 res.render('index',{flag,username,id});
})



//Routes for authentication
app.get("/register", function(req, res){
  res.render("register");
});
app.post('/register', catchAsync(async (req, res, next) => {
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
          if (err) return next(err);
          req.flash('success', 'Welcome!');
         // console.log(registeredUser);
          res.redirect('/');
      })
  } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
  }
}));

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

app.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "Goodbye!");
  console.log("logged out")
  res.redirect('/');
})

//route for entering a new room

app.post('/new-room',function(req,res){
var name = req.body.name;
var formData = {title: name};
  Room.create(formData, function(err, newRoom){
     // console.log(newRoom);
     if(err){
       
         res.render("/");
     } else {
         res.redirect("/room/"+newRoom._id);
     }
  });
})



app.get('/my-rooms',isLoggedIn, (req, res) => {
  var m=req.user;
  // var i=attendees._id;
  // const rooms = await Room.find({attendees:{$elemMatch:{_id:i}}});
  //console.log(rooms)
   User.findById(m._id).populate("rooms").exec(function(err,me){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
      res.render('all-rooms', { me:me })
    }
  })
  
});

app.get('/room/:room' ,isLoggedIn, function(req, res){
 var id=req.params.room;
  
  Room.findById(req.params.room).populate("chats").populate("attendees").exec(function(err, room){
    if(err){
      console.log(err);
        res.redirect("/");
    } else {
      var attendees=req.user;
      var i=attendees._id;
    var flag=0;
    room.attendees.forEach(function(id){
      if(i==id._id){
        flag=1;
      }
    })
     if(flag==0){
        room.attendees.push(attendees);
        room.save();
     }
     // }
     User.findById(i,function(err,p){
      if(err){
        console.log(err);
        res.redirect("room"+req.params.id)
      }else{
        var sa=0;
        p.rooms.forEach(function(rm){
          if(rm._id==room.id){
            sa=1;
          }
        })
        if(sa==0){
        p.rooms.push(room);
      //  console.log(p);
        p.save();
        }
      }
    })
        res.render("chat-room", {room: room , chat_id : id});
       // res.render('chat-room' , { roomId:req.params.room  });
    }
 });
  
})

app.get('/room/:id/chat',isLoggedIn, (req, res) => {
  Room.findById(req.params.id, function(err, room){
    if(err){
        console.log(err);
        res.redirect("/room"+req.params.id);
    } else {
            var attendees=req.user;
            var i=attendees._id;
            var flag=0;
            room.attendees.forEach(function(id){
              if(i==id._id){
                flag=1;
              }
            })
            if(flag==0){
               room.attendees.push(attendees);
               room.save();
            }
           // console.log(room);
            User.findById(i,function(err,p){
              if(err){
                console.log(err);
                res.redirect("room"+req.params.id)
              }else{
                var sa=0;
        p.rooms.forEach(function(rm){
          if(rm._id==room.id){
            sa=1;
          }
        })
        if(sa==0){
        p.rooms.push(room);
      //  console.log(p);
        p.save();
        }
              }
            })
            res.redirect('/room/' + room._id);
        
     
    }
});

  //res.redirect('/room/'+req.params.id);
})
app.post("/room/:id/chat",isLoggedIn,function(req, res){
  Room.findById(req.params.id, function(err, room){
      if(err){
          console.log(err);
          res.redirect("/room"+req.params.id);
      } else {
       Chat.create({text: req.body.text}, function(err, chat){
          if(err){
              console.log(err);
          } else {
            chat.author.id = req.user._id;
             chat.author.username = req.user.username;
             chat.save();
              room.chats.push(chat);
              room.save();
             // console.log(room);
              res.redirect('/room/' + room._id);
          }
       });
      }
  });

});
var user_c={};
app.get('/:room' , function(req, res){
  // console.log(req.user);
  // console.log(req.user.username);
  if(req.user){
    user_c =req.user;
  }else{
    user_c={
      username:"guest-user",
      _id:"60e999b4503f63361cc378dd"
    }
  }
  res.render('room' , { roomId:req.params.room , user_c: user_c});
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.returnTo = req.originalUrl
  res.redirect("/login");
}

io.on('connection' , socket=>{
  socket.on('join-room' , (roomId , userId)=>{
    console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).emit('user-connected' , userId);


    socket.on('message' ,data=>{

      Room.findById(roomId, function(err, room){
        if(err){
            console.log(err);
            res.redirect("/room"+req.params.id);
        } else {
         Chat.create({text: data.message}, function(err, chat){
            if(err){
                console.log(err);
            } else {
             
              chat.author.id = data.user_id;
               chat.author.username = data.username;
              
               chat.save();
                room.chats.push(chat);
                room.save().then(()=>{
                  io.to(roomId).emit('createMessage', data)
                })
                //console.log(room);
               // res.redirect('/room/' + room._id);
            }
         });
        }
    });


     
    })


    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
    socket.on('drawn',(data)=> {
      socket.to(roomId).emit('will_draw', data)
   })
   
   socket.on('clear_wb', ()=>{
     socket.to(roomId).emit('clear_wb')
   })

  })
})

      server.listen(process.env.PORT||3030);