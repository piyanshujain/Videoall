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

  mongoose.connect("mongodb://localhost/teams-clone",  {
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
 res.render('index');
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
          console.log(registeredUser);
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
      console.log(newRoom);
     if(err){
       
         res.render("/");
     } else {
         res.redirect("/room/"+newRoom._id);
     }
  });
})

app.get('/room/:room' , function(req, res){
  Room.findById(req.params.room).populate("chats").exec(function(err, room){
    if(err){
      console.log(err);
        res.redirect("/");
    } else {
        res.render("chat-room", {room: room});
       // res.render('chat-room' , { roomId:req.params.room  });
    }
 });
  
})
app.get('/:room' , function(req, res){
  res.render('room' , { roomId:req.params.room  });
})

io.on('connection' , socket=>{
  socket.on('join-room' , (roomId , userId)=>{
    console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).emit('user-connected' , userId);
    socket.on('message' , message=>{
      io.to(roomId).emit('createMessage', message)
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
