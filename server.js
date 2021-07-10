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

