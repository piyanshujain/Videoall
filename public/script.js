const socket =io('/')

const videoGrid = document.getElementById('video-grid')

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
var peer = new Peer(undefined ,{
  path: '/peerjs',
  host: '/' ,
  port: 443
} )

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
 addVideoStream(myVideo, stream);
  addVideoStream(myVideo, stream);
peer.on('call', call=>{
  call.answer(stream)
const video = document.createElement('video')
call.on('stream' , userVideoStream =>{
  addVideoStream(video , userVideoStream)
})
})

  socket.on('user-connected' , (userId)=>{
  // connectToNewUser(userId , stream);
   setTimeout(connectToNewUser,1000,userId,stream)
  })

  socket.on("will_draw", (data)=> {
    drawing(data);
  });
  socket.on("clear_wb",()=>{
    ClearWb();
  })
  let text = $('input')
  
  $('html').keydown((e) =>{
    if(e.which==13 && text.val().length!==0){
      socket.emit('message' , text.val());
      text.val('')
   
    }
  })
  
 
  socket.on('createMessage' , message=>{
    $('.messages').append('<li class="message"><b>user</b><br/>  </li>'+message)
    scrollToBottom()
   
  })


  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

  peer.on('open' , id=>{
  socket.emit('join-room', ROOM_ID, id);
  })



  const connectToNewUser= (userId , stream)=>{
    const call = peer.call(userId , stream)
    const video = document.createElement('video')

    call.on('stream' , userVideoStream =>{
      addVideoStream(video , userVideoStream)
    })

    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
    
  }

  const addVideoStream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata' , ()=>{
      video.play();
    })
    videoGrid.append(video);
    
  }

const scrollToBottom=()=>{
  var d=$('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

//To Mute and Unmute your Audio
const muteUnmute=()=>{
  const enabled=myVideoStream.getAudioTracks()[0].enabled;  //here [0] represents your own audio
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  }else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton=()=>{
  const html=`
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
`
document.querySelector('.main__mute__button').innerHTML=html;
}



const setUnmuteButton=()=>{
  const html=`
  <i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
`
document.querySelector('.main__mute__button').innerHTML=html;
}


const playStop=()=>{
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  }else{
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo=()=>{
  const html=`<i class="fas fa-video"></i>
  <span>Stop Video</span>`
  document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo=()=>{
  const html=`<i class=" stop fas fa-video-slash"></i>
  <span>Video</span>`
  document.querySelector('.main__video__button').innerHTML = html;
}

const leavemeet=()=>{
  window.location.href = "/";
}
<<<<<<< HEAD



=======
>>>>>>> f489058fced7ff7427efdfe52c2f90e19d95c6b5
