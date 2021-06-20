const express = require('express'),
      app     = express(),
      server  = require('http').Server(app);
      const {v4 : uuidv4} = require('uuid');


app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.get('/', (req,res)=>{
  var id=uuidv4();
  res.redirect('/$'+id);
})


app.get('/:room' , (req, res)=>{
  res.render('room' , { roomId:req.params.room});
})



      server.listen(3030);
