  <!DOCTYPE html>
  <html>
  <head>
    <title>Basic Tetris HTML Game</title>
    <meta charset="UTF-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

    <style>
    html, body {
      /* height: 100%; */
      margin: 0;
    }

    body {
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    canvas {
      border: 2px solid white;
    }
    </style>
  </head>
  <body>
  <canvas width="640" height="800" id="game"></canvas>
  <script>
    
  // https://tetris.fandom.com/wiki/Tetris_Guideline

  // get a random integer between the range of [min,max]
  // @see https://stackoverflow.com/a/1527820/2124254
  $(document).ready(function(){
      $(window).focus();
          }) 
      var h = window.innerHeight;
      var w = window.innerWidth;
      var leftColor ='',rightColor=''; 
      console.log("width : "+w+" | Height : "+h)   //before screen change
      h = h-(h%32)
      w = w-(w%32)
      console.log("width : "+w+" | Height : "+h)   //after screen change
      $("canvas").attr("height",h);

      //  if(w<640)
      //  $("canvas").attr("width",grid*fixed_);
      window.addEventListener('message', function(event) {
        console.log("mESSAGE RECEIVED"); 
          console.log(event.data.msg);
          console.log(event.data.leftColor);
          console.log(event.data.rightColor);
          leftColor =  event.data.leftColor;
          rightColor =  event.data.rightColor;
          window.parent.postMessage("Game Started", "*");
          colors['I'] = leftColor
  colors['O'] = rightColor
  colors['T'] = leftColor
  colors['S'] = rightColor
  colors['Z'] = leftColor
  colors['J'] = rightColor
  colors['L'] = leftColor
  setTimeout(function() {
                    message={msg:'Game Ended',game:"Tetris",score:score}
                    window.parent.postMessage(message, "*");
                    console.log('Game ended by Game js')
                }, event.data.time);
      });

    
  var fixed_col=10,fixed_row=h/32,score=0;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // generate a new tetromino sequence
  // @see https://tetris.fandom.com/wiki/Random_Generator


  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }

  // get the next tetromino in the sequence
  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
      name: name,      // name of the piece (L, O, etc.)
      matrix: matrix,  // the current rotation matrix
      row: row,        // current row (starts offscreen)
      col: col         // current col
    };
  }

  // rotate an NxN matrix 90deg
  // @see https://codereview.stackexchange.com/a/186834
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );

    return result;
  }


  function drawScore() {
  // score=1;
        context.fillStyle = '#fff';
        context.font = '35px sans-serif';

        // syntax --> fillText(text, x, y)
        context.fillText(score, 10, 30);
      }


  // check to see if the new matrix/row/col is valid
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            // collides with another piece
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }

    return true;
  }

  // place the tetromino on the playfield
  function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            // return showGameOver();
            for (let r =0; r <= fixed_row; r++) {
               for (let c = 0; c < playfield[r].length; c++) {
                   playfield[r][c] = playfield[r-1][c];
               }
            }
          }else
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }

    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0; ) {
      if (playfield[row].every(cell => !!cell)) {
        console.log("Cleared")
        score+=fixed_col;
        console.log("Score : "+score)
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }

    tetromino = getNextTetromino();
  }

  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  }

  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  // $("canvas").attr("width",w);
  const grid = 32;
  // $("canvas").attr("height",h);
  console.log(grid)
  const tetrominoSequence = [];

  // keep track of what is in every cell of the game using a 2d array
  // tetris playfield is 10x20, with a few rows offscreen
  var playfield = [];

  // populate the empty state
  for (let row = -2; row < fixed_row; row++) {
    playfield[row] = [];

    for (let col = 0; col < fixed_col; col++) {
      playfield[row][col] = 0;
    }
  }

  // how to draw each tetromino
  // @see https://tetris.fandom.com/wiki/SRS
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };

  // color of each tetromino
  const colors = {};
    colors['I'] = leftColor
    colors['O'] = rightColor
    colors['T'] = leftColor
    colors['S'] = rightColor
    colors['Z'] = leftColor
    colors['J'] = rightColor
    colors['L'] = leftColor
  // const colors = {
  //   'I': 'cyan',
  //   'O': 'yellow',
  //   'T': 'purple',
  //   'S': 'green',
  //   'Z': 'red',
  //   'J': 'blue',
  //   'L': 'orange'
  // };

  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;  // keep track of the animation frame so we can cancel it
  let gameOver = false;

  // game loop
  function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);

    // draw the playfield
    for (let row = 0; row < fixed_row; row++) {
      for (let col = 0; col < fixed_col; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];
        
          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        
        }
      }
    }
    drawScore();
    // draw the active tetromino
    if (tetromino) {

      // tetromino falls every 35 frames
      if (++count > 35) {
        tetromino.row++;
        count = 0;

        // place piece if it runs into anything
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }

      context.fillStyle = colors[tetromino.name];

      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }

  // listen to keyboard events to move the active tetromino
  document.addEventListener('keydown', function(e) {
    if (gameOver) return;

    // left and right arrow keys (move)
    if (e.which === 37 || e.which === 39) {
      const col = e.which === 37
        ? tetromino.col - 1
        : tetromino.col + 1;

      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }

    // up arrow key (rotate)
    if (e.which === 38) {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }

    // down arrow key (drop)
    if(e.which === 40) {
      const row = tetromino.row + 1;

      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;

        placeTetromino();
        return;
      }

      tetromino.row = row;
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
  
    if (Math.abs(x) > treshold || Math.abs(y) > treshold ) {
        if (yx <= limit) {
            if (x < 0) {
                console.log("left");
                const col = tetromino.col - 1

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
            } else {
                console.log("right");
                const col = tetromino.col + 1

if (isValidMove(tetromino.matrix, tetromino.row, col)) {
  tetromino.col = col;}
            }
        }
        if (xy <= limit) {
            if (y < 0 ) {
                console.log("top");
                const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
            } else {
                const row = tetromino.row + 1;
                  
if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
  tetromino.row = row - 1;

  placeTetromino();
  return;
}

tetromino.row = row;
}
        }
    } else {
        console.log("tap");
    }
}

  // start the game
  rAF = requestAnimationFrame(loop);
  </script>
  </body>
  </html>