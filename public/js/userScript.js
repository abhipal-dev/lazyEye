$(document).on('click', '#sidebarToggle', function (event) {
  event.preventDefault();
  document.body.classList.toggle('sb-sidenav-toggled');
  localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
});

function sweetAlert(head, msg, type) {
  Swal.fire(
    head,
    msg,
    type,
  )
};

function markPlayedGame(game_name){
  if(game_name=='Snake'){
    $('div.Snake').css({'background-color':'green'})
    $('div.Snake button').prop('disabled', true);
}
if(game_name=='Flappy Bird'){
    $('div.FlappyBird').css({'background-color':'green'})
    $('div.FlappyBird button').prop('disabled', true);
}
if(game_name=='Sticky Holds'){
    $('div.StickyHolds').css({'background-color':'green'})
    $('div.StickyHolds button').prop('disabled', true);
}
if(game_name=='Menja'){
    console.log('entered menja')
    $("div.Menja").css("background-color","green")
    $("div.Menja button").prop("disabled", true);
}
if(game_name=='Tetris'){
    console.log('entered')
    $('div.Tetris').css({'background-color':'green'})
    $('div.Tetris button').prop('disabled', true);
}
if(game_name=='Bubble Shooter'){
    $('div.BubbleShooter').css({'background-color':'green'})
    $('div.BubbleShooter button').prop('disabled', true);
}
if(game_name=='Ping Pong'){
    $('div.PingPong').css({'background-color':'green'})
    $('div.PingPong button').prop('disabled', true);
}
if(game_name=='Maze'){
    $('div.Maze').css({'background-color':'green'})
    $('div.Maze button').prop('disabled', true);
}
if(game_name=='Ball Catcher'){
    $('div.BallCatcher').css({'background-color':'green'})
    $('div.BallCatcher button').prop('disabled', true);
}
if(game_name=='Bouncing Ball'){
    $('div.BouncingBall').css({'background-color':'green'})
    $('div.BouncingBall button').prop('disabled', true);
}
}

$(document).on('fullscreenchange', function (e) {
  if (document.fullscreenElement) {
    // Entered fullscreen
  } else {
    // Left fullscreen; run your code here
    console.log('pressed escape user page')
    var elem = document.getElementById('iframe');
    // elem.src = "";
  }
});



$(document).ready(function () {
  // console.log("ready!");
  window.addEventListener('message', function (event) {
    console.log("Message received from the child: " + event.data.msg); // Message received from child
    if (event.data.msg == 'Game Ended') {
      document.getElementById("iframe").src = "";
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
    if (event.data.msg == 'Game Ended') {
      Swal.fire({
        title: `${event.data.game || 'Session'} Finished!`,
        text: 'Great effort! Your session score is: ' + (event.data.score !== undefined ? event.data.score : 0),
        icon: 'success',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'Continue'
      });

      markPlayedGame(event.data.game);

      //function to get date in format (dd-mm-yyyy)
      let current_date_timestamp = moment().unix()*1000;
      console.log(current_date_timestamp)     // current's Date
      let str = $('p#score_history').text();
      let id = document.querySelector("section#user").dataset.id;
      let score = {}, temp_score = {}, string_score = '';
      if (str.length) {
        score = JSON.parse(str)
      }
      temp_score[current_date_timestamp] = {}
      temp_score[current_date_timestamp][event.data.game] = event.data.score;

      if (score.hasOwnProperty(current_date_timestamp)) {
        console.log("Found Date")
        score[current_date_timestamp] = Object.assign(score[current_date_timestamp], temp_score[current_date_timestamp])
      } else {
        console.log("Date Not found")
        score = Object.assign(score, temp_score)
      }
      console.log("Score var")
      console.log(score)
      string_score = JSON.stringify(score);
      let token = $('meta[name="csrf-token" ]').attr('content');
      $.ajax({
        url: "/SaveGameRecords",
        type: "post",
        headers: { 'X-CSRF-TOKEN': token },
        data: { 
          id: id, 
          score: score, 
          string_score: string_score,
          game_name: event.data.game,
          game_score: event.data.score,
          duration: 1200
        },
        success: function (data) {
          console.log("Game recorded in normalized UTC table:", data);
        }
      });
    }
  });


});

//**************************** */ Event on change of frame src and its loading  *********************************
$('#iframe').on('load', function () {
  console.log("Changed : " + document.getElementById("iframe").src)
  if (document.getElementById("iframe").src) {
    leftDiv = document.querySelector('#leftColorTestDiv'),
      rightDiv = document.querySelector('#rightColorTestDiv')
    l = document.querySelector('#leftColorContrastSlider')
    r = document.querySelector('#rightColorContrastSlider')
    let leftColorName = document.getElementById('leftEyeColor').value
    let rightColorName = document.getElementById('rightEyeColor').value
    leftColor = leftDiv.innerHTML
    rightColor = rightDiv.innerHTML
    let leftContrast = l.value
    let rightContrast = r.value
    let rawMin = +($('#time').text());
    let minute = (!rawMin || isNaN(rawMin) || rawMin <= 0) ? 20 : rawMin;
    console.log("Prescribed game minutes: " + minute);
    message = { 
      time: minute * 60 * 1000, 
      leftColorName: leftColorName, 
      leftColor: leftColor, 
      rightColorName: rightColorName, 
      rightColor: rightColor, 
      leftContrast: l.value, 
      rightContrast: r.value, 
      msg: "Hello" 
    };
    document.querySelector("iframe").contentWindow.postMessage(message, "*");
  }
});


//**************************** */ Removing frame src on exiting fullscreen  *********************************

$(document).on('fullscreenchange', function (e) {
  let message = {}
  console.log("Fullscreen state change")
  if (document.fullscreenElement) {
    // Entered fullscreen
  } else {
    localStorage.setItem("game_state", 0)
    console.log("State : " + localStorage.getItem("game_state"));
    document.querySelector("iframe").contentWindow.localStorage.clear();
    document.getElementById('iframe').src = "";
    console.log('Src React: ' + document.getElementById("iframe").src)
  }
});


function logOutAlert() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will be Logged Out !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Log Out !'
  }).then((result) => {
    if (result.isConfirmed) {
      let token = $('meta[name="csrf-token" ]').attr('content');
      $.ajax({
        url: "/Logout",
        type: "post",
        headers: { 'X-CSRF-TOKEN': token },
        success: function (data) {
          window.location.href = "/Login_view";
        }
      });
      Swal.fire(
        'Logged Out!',
        'You are Logged Out',
        'success'
      )
    }
  })
}

$(document).on('click', '#sidebarToggle', function (event) {
  event.preventDefault();
  document.body.classList.toggle('sb-sidenav-toggled');
  localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
});

$(document).on('click', '.logoutButton', function () {
  logOutAlert();
});

function sweetAlert(head, msg, type) {
  Swal.fire({
    head,
    msg,
    type,
  })
};



$(document).on('submit', 'form[name="imageUpload"]', function (e) {
  e.preventDefault();
  let form = $(this);
  let formData = new FormData($(this)[0]);
  let token = $('meta[name="csrf-token"]').attr('content');
  console.log(formData)
  $.ajax({
    url: "/uploadImage",
    type: "post",
    processData: false,
    contentType: false,
    headers: { 'X-CSRF-TOKEN': token },
    data: formData,
    success: function (data) {
      if (data) {
        $('#uploadImageModal').modal('hide')
        Swal.fire(
          'Updation Success!',
          'User profile image is updated',
          'success'
        )
      }
      else {
        $('#uploadImageModal').modal('hide')
        Swal.fire(
          'Updation Failed!',
          'User profile image is not updated',
          'error'
        )
      }
      $('form[name="imageUpload"]').reset();
    }
  });
});
