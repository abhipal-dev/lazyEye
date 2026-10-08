<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jump and Run Game</title>
  <!-- <link rel="stylesheet" href="css/game7style.css"> -->\
  <script src="https://code.jquery.com/jquery-3.6.3.min.js"
    integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    :root {
  --character-bg-color: red;
  --obstacle-bg-color: blue;
  --ground-bg-color: blue;
}
    body {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background-color: black;
    }

    #ground {
      width: 100%;
      height: 100px;
      background-color: var(--ground-bg-color);
      position: absolute;
      bottom: 0;
    }

    #character {
      width: 50px;
      height: 50px;
      background-color: var(--character-bg-color);
      border-radius: 50%;
      position: absolute;
      bottom: 100px;
      right: calc(100% - 680px);
    }

    .obstacle {
      width: 30px;
      height: 100px;
      background-color: var(--obstacle-bg-color);
      position: absolute;
      bottom: 100px;
      right: 0;
    }

    h2 {
      font-family: sans-serif;
      margin-top: 10px;
      margin-left: 10px;
    }

    #score {
      color: red;
    }
  </style>
</head>

<body>
  <div id="ground"></div>
  <div id="character"></div>
  <div class="obstacles"></div>
  <h2 style="color:red">Score: <span id="score">0</span></h2>
  <script>
    var leftColor='',rightColor='',state
    window.onload = function () {
      // localStorage.clear();
      state = localStorage.getItem("game_state");
      if(!state){
      localStorage.clear()
      // localStorage.setItem("seconds",10000);
      }
      let name = localStorage.getItem("name");
      let seconds = localStorage.getItem("seconds");
      let temp_score = localStorage.getItem("score");
      // console.log("state :" + state)
      // console.log("name :" + name)
      // console.log("score:" + temp_score)
      // console.log("seconds:" + seconds)
      if (temp_score&&state) {
        score = +(temp_score)
        drawScore();
      }
      else
        score = 0
      localStorage.setItem("game_state",1)
    }
    window.onbeforeunload = function () {
      // localStorage.clear();
      // if (state != 2) {
        localStorage.setItem("name", "Abhishek Pal");
        // localStorage.setItem("state", 1);
        localStorage.setItem("score", score);
        localStorage.setItem("seconds",sw.now);
        // state = 0;
      // }
    }

    $(document).ready(function () {
      $(window).focus();
     
    })

    window.addEventListener('message', function (event) {
      console.log("MESSAGE RECEIVED");
        // console.log("msg : "+event.data.msg);
        // console.log("leftcolor : "+event.data.leftColor);
        // console.log("rightcolor : "+event.data.rightColor);
        console.log("time : "+event.data.time);
        // console.log("Name : "+localStorage.getItem("name"));
        // console.log("Score : "+localStorage.getItem("score"));
        if(!state){
      // localStorage.clear()
      localStorage.setItem("seconds",0);
        let rawMin = (event.data.time / 1000) / 60;
        user_allotted_time = (!rawMin || isNaN(rawMin) || rawMin <= 0) ? 20 : rawMin;
        leftColor = event.data.leftColor;
        rightColor = event.data.rightColor;
        
        const root = document.querySelector(':root');
        root.style.setProperty('--obstacle-bg-color', rightColor);
        root.style.setProperty('--ground-bg-color', rightColor);
        root.style.setProperty('--character-bg-color', leftColor);
        setInterval(drawScore,500);
        sw.now = localStorage.getItem("seconds")
        sw.start();
    });

    // localStorage.setItem("secs",200)
// let s = localStorage.getItem("seconds")
var user_allotted_time;
var sw = {
  // (A) PROPERTIES
  etime : null, // html time display
  erst : null,  // html reset button
  ego : null,   // html start/stop button
  timer : null, // timer object
  now : localStorage.getItem("seconds"),      // current elapsed time

  // (B) INITIALIZE
  init : () => {
 
  },

  // (C) START!
  start : () => {
    sw.timer = setInterval(sw.tick, 1000);
   
  },

  // (D) STOP
  stop : () => {
    clearInterval(sw.timer);
    sw.timer = null;
   
  },

  // (E) TIMER ACTION
  tick : () => {
    // (E1) CALCULATE HOURS, MINS, SECONDS
    sw.now++;
    let hours = 0, mins = 0, secs = 0,
    remain = sw.now;
    hours = Math.floor(remain / 3600);
    remain -= hours * 3600;
    mins = Math.floor(remain / 60);
    remain -= mins * 60;
    secs = remain;
    if(mins==user_allotted_time){
      localStorage.clear()
         message = { msg: 'Game Ended',game:"Bouncing Ball", score: score }
          window.parent.postMessage(message, "*");
          console.log('Game ended by Game js')
    }
    // (E2) UPDATE THE DISPLAY TIMER
    if (hours<10) { hours = "0" + hours; }
    if (mins<10) { mins = "0" + mins; }
    if (secs<10) { secs = "0" + secs; }
    // sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
    console.log(hours + ":" + mins + ":" + secs);
  },

  // (F) RESET
  reset : () => {
    if (sw.timer != null) { sw.stop(); }
    sw.now = -1;
    sw.tick();
  }
};
window.addEventListener("load", sw.init);

    let score=0;
    let character = document.getElementById('character');
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
    let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
    let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));

    let ground = document.getElementById('ground');

    let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('Bottom'));
    let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));

    let isJumping = false;
    let upTime;
    let downTime;
    let displayScore = document.getElementById('score');



    function jump() {
      console.log(isJumping)
      if (isJumping) return;
      upTime = setInterval(() => {
        if (characterBottom >= groundHeight + 250) {
          clearInterval(upTime);
          downTime = setInterval(() => {
            if (characterBottom <= groundHeight + 10) {
              clearInterval(downTime)
              // score += 1;
              // displayScore.textContent = score;
              isJumping = false;
            }
            characterBottom -= 10;
            character.style.bottom = characterBottom + 'px';
          }, 20)
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + 'px';
        isJumping = true;
      }, 20)
    }

    function drawScore() {
      score++;
      // console.log(score)
      displayScore.textContent = score;
     }

    // setInterval(drawScore, 100);

    function generateObstacle() {
      let obstacles = document.querySelector('.obstacles');
      let obstacle = document.createElement('div');
      obstacle.setAttribute('class', 'obstacle');
      obstacles.appendChild(obstacle);

      let randomTimeout = Math.floor(Math.random() * 1000) + 1500;
      let obstacleRight = -30;
      let obstacleBottom = 100;
      let obstacleWidth = 30;
      let temp = Math.floor(Math.random() * 60)
      let obstacleHeight = temp + 40;
      // console.log(temp )
      obstacle.style.background = 'rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})';


      function removeObstacles(className) { //function to remove obstacle using class
        const elements = document.getElementsByClassName(className);
        console.log("elements:" + elements)
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      }


      function moveObstacle() {
        obstacleRight += 4;
        obstacle.style.right = obstacleRight + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        if (characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight) {
         
          clearInterval(obstacleInterval);
          clearTimeout(obstacleTimeout);
         
          location.reload()
          return false;

        }
      }
      let obstacleInterval = setInterval(moveObstacle, 20);
      let obstacleTimeout = setTimeout(generateObstacle, randomTimeout);
 
    }
    generateObstacle()

    function control(e) {
      console.log(e.key)
      if (e.key == "ArrowUp" || e.key == '') {
        jump();

        // obstacleRight = -30+"px";
      }

    }



    document.addEventListener('keydown', control);
  </script>
</body>

</html>