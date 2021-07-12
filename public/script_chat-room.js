
$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
    $( '.chat-bubble' ).hide('slow').show('slow');
    
  });
  
/* Set the width of the slidebar to 250px and the left margin of the page content to 250px */
function toggleNav() {
  const wid=document.getElementById("mySlidebar").style.width;
  if(wid=="0px"){
    document.getElementById("mySlidebar").style.width = "200px";
     document.getElementById("main-side").style.marginRight = "250px";
  }else{
    document.getElementById("mySlidebar").style.width = "0";
    document.getElementById("main-side").style.marginRight = "0";
  }
  }
  
  /* Set the width of the slidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySlidebar").style.width = "0";
    document.getElementById("main-side").style.marginRight = "0";
  }
  // Video tutorial/codealong here: https://youtu.be/fCpw5i_2IYU

  function startCall(){
    window.location.href = "/"+room_i;
  }