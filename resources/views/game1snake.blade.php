<!DOCTYPE html>
<html>
<head>
  <title>Basic Snake HTML Game</title>
  <meta charset="UTF-8">
            <meta name="csrf-token" content="{{ csrf_token() }}" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

            
  <style>
    *{
      margin:0;
      padding:0;
    }
    div.snake_game{
      width:100%;
      height:100%;
    }
  canvas{
    background-color:black;
    width:100%;
      height:100%;
  }
 
  </style>
</head>
<body>
  <div class="snake_game" id="myGame">
  <!-- width="1270" height="800"  -->
    <canvas id="game" width="1200" height="800" autofocus></canvas>
  </div>
<script>
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('body').css({
        "-webkit-transform": "rotate(90deg)"
    }); 
    var h = window.innerWidth;
    var w = window.innerHeight;
}else{
    var h = window.innerHeight;
    var w = window.innerWidth;
}


  var elem = document.getElementById("myGame");
  // document.getElementById('game').focus();
   $(document).ready(function(){
    $(window).focus();
        //   setTimeout(function() {
        //     message={msg:'Game Ended',score:score}
        //     window.parent.postMessage(message, "*");
        //     console.log('Game ended by Game js')
        // }, 300000);
        }) 

    var leftColor ='',rightColor='',colors=[],random_apple_color=''; 
    h = h-(h%16)
    w = w-(w%16)
    //  console.log("width : "+w+" | Height : "+h)   
    $('canvas').height(h);
    $('canvas').width(w); 
    window.addEventListener('message', function(event) {
      console.log("mESSAGE RECEIVED"); 
         console.log(event.data.msg);
         console.log(event.data.leftColor);
         console.log(event.data.rightColor);
         console.log("Time : "+event.data.time);
         leftColor =  event.data.leftColor;
         rightColor =  event.data.rightColor;
         colors.push(leftColor)
         colors.push(rightColor)
         random_apple_color = leftColor;
         console.log(colors)
         setTimeout(function() {
            message={msg:'Game Ended',game:'Snake',score:score}
            window.parent.postMessage(message, "*");
            console.log('Game ended by Game js')
        }, event.data.time);
        window.parent.postMessage("Game Started", "*");
      

    });
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
// canvas.focus()
// context.focus()

// the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the grid size in order for collision detection to work
// (e.g. 16 * 25 = 400)
var control=[],prev_command;
var grid = 16;
var count = 0;
var score=0;

var snake = {
  x: 16,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 8) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
    // console.log('first Runnnnn  dx->'+snake.dx+"  dy->"+snake.dy)
    if(control.length){
  // console.log("prev_command : "+prev_command)
  // console.log("control[0] : "+control[0])
  if((control[0]%2)==(prev_command%2)){
    // alert("*********************")
    control.shift()
  }
  else  if (control[0] == 37 && snake.dx === 0) {
    prev_command = control[0]
    // console.log('37 Runnnnn  dx->'+snake.dx+"  dy->"+snake.dy)
    control.shift()
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (control[0] == 38 && snake.dy === 0) {
    prev_command = control[0]
    // console.log('38 Runnnnn  dx->'+snake.dx+"  dy->"+snake.dy)
    control.shift()
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (control[0] == 39 && snake.dx === 0) {
    prev_command = control[0]
    control.shift()
    // console.log('39 Runnnnn  dx->'+snake.dx+"  dy->"+snake.dy)
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (control[0] == 40 && snake.dy === 0) {
    prev_command = control[0]
    control.shift()
    // console.log('40 Runnnnn  dx->'+snake.dx+"  dy->"+snake.dy)
    snake.dy = grid;
    snake.dx = 0;
  } 
  }
  }

  // draw apple
  context.fillStyle = random_apple_color;
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // draw snake one cell at a time
  context.fillStyle = 'white';
  snake.cells.forEach(function(cell, index) {

    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      // console.log()
      snake.maxCells++;
      score++; //****************************** Score ***********************************************/   
      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      console.log(score)
      random_apple_color = colors[Math.floor(Math.random() * colors.length)];
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  if(e.which===37||e.which===38||e.which===39||e.which===40)
  if(control.length && (control[control.length-1]==e.which)){
      // control.pop()
  }
  else{
    // console.log("array last : "+prev_input%2)
    console.log("input : "+e.which%2)
    // if(!((prev_input%2)==(e.which%2))){
    //   prev_input=e.which
      control.push(e.which)
    // }
    
  }
});


// Touch Test
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
//const gestureZone = document.getElementById('modalContent');

canvas.addEventListener('touchstart', function(event) {
    event.preventDefault()  
  touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

canvas.addEventListener('touchend', function(event) {
      event.preventDefault()
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold || snake.dx === 0 ) {
        if (yx <= limit) {
            if (x < 0) {
                console.log("left");
              if (snake.dx === 0){ 
              snake.dx = grid;
               snake.dy = 0;};
            } else {
                console.log("right");
              if (snake.dx === 0){
              snake.dx = -grid;
               snake.dy = 0;}
            }
        }
        if (xy <= limit) {
            if (y < 0 ) {
                console.log("top");
              if (snake.dy === 0){
              
              snake.dy =grid;
                    snake.dx = 0;}
            } else {
           
              console.log("bottom");
              if (snake.dy === 0){
                 snake.dy = -grid;
                snake.dx = 0;
            }}
        }
    } else {
        console.log("tap");
    }
}

// start the game
requestAnimationFrame(loop);

</script>
</body>
</html>