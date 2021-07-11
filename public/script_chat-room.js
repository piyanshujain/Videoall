
$( '.friend-drawer--onhover' ).on( 'click',  function() {
  
    $( '.chat-bubble' ).hide('slow').show('slow');
    
  });
  
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "200px";
    document.getElementById("main").style.marginRight = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
  }
  // Video tutorial/codealong here: https://youtu.be/fCpw5i_2IYU

  function startCall(){
    window.location.href = "/"+room_i;
  }