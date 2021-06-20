const express = require('express'),
      app     = express(),
      server  = require('http').Server(app);
      const {v4 : uuidv4} = require('uuid');
      const io = require('socket.io')(server)
      const { ExpressPeerServer } = require('peer');
      const peerServer = ExpressPeerServer(server , {
        debug: true
      }) 


      app.set('view engine' , 'ejs');
      app.use(express.static('public'));
      app.use('/peerjs' , peerServer);

      
app.get('/', (req,res)=>{
  var id=uuidv4();
  res.redirect('/$'+id);
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
  })
})


      server.listen(3030);
