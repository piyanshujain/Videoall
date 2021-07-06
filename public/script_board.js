
var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black",
y = 2;

function init() {
canvas = document.getElementById('can');
ctx = canvas.getContext("2d");
w = canvas.width;
h = canvas.height;

canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
}, false);
}

function color(obj) {
switch (obj.id) {
    case "blue":
        x = "blue";
        break;
    case "red":
        x = "red";
        break;
    case "yellow":
        x = "yellow";
        break;
    case "black":
        x = "black";
        break;
    case "white":
        x = "white";
        break;
}
if (x == "white") y = 14;
else y = 2;

}


function draw() {
  var  data={
        pX :prevX, 
        pY :prevY , 
        cX :currX , 
        cY :currY , 
        xi :x , 
        yi :y
    }
ctx.beginPath();
ctx.moveTo(prevX, prevY);
ctx.lineTo(currX, currY);
ctx.strokeStyle = x;
ctx.lineWidth = y;
ctx.stroke();
ctx.closePath();
socket.emit("drawn", data);
}

const drawing=(data)=>{
    ctx.beginPath();
    ctx.moveTo(data.pX, data.pY);
    ctx.lineTo(data.cX, data.cY);
    ctx.strokeStyle = data.xi;
    ctx.lineWidth = data.yi;
    ctx.stroke();
    ctx.closePath();
}
function erase() {
var m = confirm("Sure to clear the Board?");
if (m) {
    ctx.clearRect(0, 0, w, h);
    socket.emit("clear_wb");
}
}

ClearWb=()=>{
    ctx.clearRect(0, 0, w, h);
}

function save() {
var dataURL = canvas.toDataURL();
downloadImage(dataURL, 'image.png');
}

function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

function findxy(res, e) {
if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
        ctx.beginPath();
        ctx.fillStyle = x;
        ctx.fillRect(currX, currY, 2, 2);
        ctx.closePath();
        dot_flag = false;
    }
}
if (res == 'up' || res == "out") {
    flag = false;
}
if (res == 'move') {
    
    if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw(prevX , prevY , currX , currY , x , y);
       
    }
}
}


const openCloseWb=()=> {
const state=document.getElementById("myForm").style.display;
if(state==="none"){
    document.getElementById("myForm").style.display = "block";
  document.getElementById("video-grid").style.display = "none";
  setVideoButton();
}else{
    document.getElementById("myForm").style.display = "none";
    document.getElementById("video-grid").style.display = "block";
    setWbButton();
}
}

const setVideoButton=()=>{
    const html=`<span>Videos</span>`
    document.querySelector('.main__wb__button').innerHTML=html;
}

const setWbButton=()=>{
    const html=`<span>Whiteboard</span>`
    document.querySelector('.main__wb__button').innerHTML=html;
}