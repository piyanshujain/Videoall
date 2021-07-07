const express = require('express'),
      app     = express(),
      server  = require('http').Server(app);
      const {v4 : uuidv4} = require('uuid');
      const io = require('socket.io')(server)
      const { ExpressPeerServer } = require('peer');
      const peerServer = ExpressPeerServer(server , {
        debug: true
      }) 
      const mongoose              = require("mongoose"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSanitizer      = require("express-sanitizer"),
      User                  = require("./models/user"),
      passport              = require('passport');

  mongoose.connect("mongodb://localhost/teams-clone",  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

    app.use(require("express-session")({
      secret: "Rusty is the best and cutest dog in the world",
      resave: false,
      saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});
app.use(expressSanitizer());

app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.use('/peerjs' , peerServer);

app.get('/', (req,res)=>{
  var id=uuidv4();
 res.render('index', {id :id});
})


app.get('/:room' , (req, res)=>{
  res.render('room' , { roomId:req.params.room});
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
