<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tetris Fusion - LazyEye Therapy</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: radial-gradient(circle at center, #111827 0%, #030712 100%);
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 10px;
    }

    .tetris-arcade-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 24px;
      max-width: 900px;
      width: 100%;
    }

    /* Playfield Column */
    .playfield-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .canvas-border-glow {
      position: relative;
      padding: 4px;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(6, 182, 212, 0.4));
      border-radius: 12px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.15);
    }

    canvas#game {
      display: block;
      background: #000000;
      border-radius: 8px;
    }

    /* Sidebar HUD */
    .hud-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 240px;
    }

    .hud-title-box {
      background: rgba(17, 24, 39, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      backdrop-filter: blur(8px);
    }

    .hud-title-box h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #f87171, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }

    .hud-title-box p {
      font-size: 11px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Dichoptic Eye Indicator */
    .therapy-status-pill {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 12px;
    }

    .eye-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }

    .eye-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }

    /* Next Piece Card */
    .next-card {
      background: rgba(17, 24, 39, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      backdrop-filter: blur(8px);
    }

    .hud-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    canvas#nextCanvas {
      background: #030712;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .stat-card {
      background: rgba(17, 24, 39, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #38bdf8;
      font-variant-numeric: tabular-nums;
      margin-top: 2px;
    }

    /* Controls Guide */
    .controls-guide {
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 10px;
      font-size: 11px;
      color: #94a3b8;
    }

    .controls-guide div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .key-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      color: #f1f5f9;
      font-family: monospace;
      font-size: 10px;
    }

    /* Mobile Virtual Controls */
    .mobile-controls {
      display: none;
      margin-top: 10px;
      width: 100%;
      max-width: 320px;
      gap: 8px;
    }

    .dpad-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      width: 100%;
    }

    .btn-virtual {
      background: rgba(30, 41, 59, 0.9);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      height: 48px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      active: scale(0.95);
      touch-action: manipulation;
    }

    .btn-virtual:active {
      background: rgba(56, 189, 248, 0.3);
      border-color: #38bdf8;
    }

    .btn-hard-drop {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }

    /* Game Over Modal Overlay */
    .game-over-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.88);
      border-radius: 8px;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      z-index: 20;
      padding: 20px;
      text-align: center;
    }

    .game-over-overlay h2 {
      font-size: 26px;
      font-weight: 800;
      color: #ef4444;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }

    .game-over-overlay p {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }

    .btn-restart {
      background: linear-gradient(135deg, #ef4444, #06b6d4);
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
      transition: transform 0.15s ease;
    }

    .btn-restart:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      body {
        padding: 5px;
        align-items: flex-start;
        overflow-y: auto;
      }
      .tetris-arcade-wrap {
        flex-direction: column;
        gap: 12px;
      }
      .hud-panel {
        width: 100%;
        max-width: 320px;
        order: -1;
        gap: 8px;
      }
      .controls-guide {
        display: none;
      }
      .mobile-controls {
        display: flex;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>

  <div class="tetris-arcade-wrap">
    <!-- Playfield Panel -->
    <div class="playfield-panel">
      <div class="canvas-border-glow">
        <canvas id="game"></canvas>
        <div id="gameOverOverlay" class="game-over-overlay">
          <h2>GAME OVER</h2>
          <p>Score: <span id="finalScore">0</span></p>
          <button id="restartBtn" class="btn-restart"><i class="fa-solid fa-rotate-right"></i> Play Again</button>
        </div>
      </div>

      <!-- Mobile Touch Controls -->
      <div class="mobile-controls">
        <div class="dpad-row">
          <button class="btn-virtual" id="btnRotate" title="Rotate"><i class="fa-solid fa-rotate"></i></button>
          <button class="btn-virtual btn-hard-drop" id="btnHardDrop" title="Hard Drop"><i class="fa-solid fa-angles-down"></i></button>
        </div>
        <div class="dpad-row">
          <button class="btn-virtual" id="btnLeft" title="Left"><i class="fa-solid fa-arrow-left"></i></button>
          <button class="btn-virtual" id="btnDown" title="Soft Drop"><i class="fa-solid fa-arrow-down"></i></button>
          <button class="btn-virtual" id="btnRight" title="Right"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>

    <!-- HUD Sidebar -->
    <div class="hud-panel">
      <div class="hud-title-box">
        <h1>TETRIS FUSION</h1>
        <p>Binocular Fusion Therapy</p>
      </div>

      <!-- Dichoptic Vision Colors Status -->
      <div class="therapy-status-pill">
        <div class="eye-indicator">
          <span class="eye-dot" id="leftDot" style="color: #ef4444; background: #ef4444;"></span>
          <span id="leftLabel">Left Eye</span>
        </div>
        <div class="eye-indicator">
          <span class="eye-dot" id="rightDot" style="color: #06b6d4; background: #06b6d4;"></span>
          <span id="rightLabel">Right Eye</span>
        </div>
      </div>

      <!-- Next Piece Preview -->
      <div class="next-card">
        <span class="hud-label">NEXT PIECE</span>
        <canvas id="nextCanvas" width="110" height="90"></canvas>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="hud-label">SCORE</span>
          <div class="stat-value" id="scoreDisplay">0</div>
        </div>
        <div class="stat-card">
          <span class="hud-label">LINES</span>
          <div class="stat-value" id="linesDisplay">0</div>
        </div>
        <div class="stat-card">
          <span class="hud-label">LEVEL</span>
          <div class="stat-value" id="levelDisplay">1</div>
        </div>
        <div class="stat-card">
          <span class="hud-label">SESSION</span>
          <div class="stat-value" id="timerDisplay">20:00</div>
        </div>
      </div>

      <!-- Keyboard Controls Guide -->
      <div class="controls-guide">
        <div><span>Move:</span> <span class="key-badge">← →</span></div>
        <div><span>Rotate:</span> <span class="key-badge">↑ / W</span></div>
        <div><span>Soft Drop:</span> <span class="key-badge">↓ / S</span></div>
        <div><span>Hard Drop:</span> <span class="key-badge">Space</span></div>
      </div>
    </div>
  </div>

  <script>
    // --- Canvas Setup & Proportions ---
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextCanvas');
    const nextContext = nextCanvas.getContext('2d');

    const COLS = 10;
    const ROWS = 20;

    // Dynamically size grid so playfield fits comfortably without distortion
    function calculateGridSize() {
      const availableH = window.innerHeight - 100;
      const calculated = Math.floor(availableH / ROWS);
      // Clamp between 22px and 34px
      return Math.max(22, Math.min(34, calculated));
    }

    let grid = calculateGridSize();
    canvas.width = COLS * grid;
    canvas.height = ROWS * grid;

    // --- State Variables ---
    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';
    let score = 0;
    let lines = 0;
    let level = 1;
    let gameOver = false;
    let rAF = null;
    let dropCounter = 0;
    let dropInterval = 40; // frames per drop

    // Dichoptic mapping: shapes alternate between Left and Right eye filters
    const pieceEyeMap = {
      'I': 'left',
      'O': 'right',
      'T': 'left',
      'S': 'right',
      'Z': 'left',
      'J': 'right',
      'L': 'left'
    };

    function getColorForPiece(name) {
      return pieceEyeMap[name] === 'left' ? leftColor : rightColor;
    }

    function updateEyeColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;
      document.getElementById('leftDot').style.color = leftColor;
      document.getElementById('leftDot').style.background = leftColor;
      document.getElementById('rightDot').style.color = rightColor;
      document.getElementById('rightDot').style.background = rightColor;
      drawNextPiece();
    }

    // --- Tetromino Definitions (SRS) ---
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
        [0,0,0]
      ],
      'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0]
      ],
      'O': [
        [1,1],
        [1,1]
      ],
      'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0]
      ],
      'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0]
      ],
      'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0]
      ]
    };

    // --- Sequence Generator (Bag of 7) ---
    let tetrominoSequence = [];
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateSequence() {
      const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
      }
    }

    let nextPieceName = null;
    let currentTetromino = null;

    function getNextPiece() {
      if (tetrominoSequence.length === 0) {
        generateSequence();
      }
      const name = tetrominoSequence.pop();
      const matrix = tetrominos[name];
      const col = Math.floor(COLS / 2) - Math.ceil(matrix[0].length / 2);
      const row = name === 'I' ? -1 : -2;

      return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
      };
    }

    // --- Playfield Grid (10x20) ---
    let playfield = [];
    function initPlayfield() {
      playfield = [];
      for (let r = -2; r < ROWS; r++) {
        playfield[r] = [];
        for (let c = 0; c < COLS; c++) {
          playfield[r][c] = 0;
        }
      }
    }

    function rotate(matrix) {
      const N = matrix.length - 1;
      return matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
      );
    }

    function isValidMove(matrix, cellRow, cellCol) {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            if (cellCol + c < 0 || cellCol + c >= COLS || cellRow + r >= ROWS) {
              return false;
            }
            if (cellRow + r >= 0 && playfield[cellRow + r][cellCol + c]) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function placeTetromino() {
      for (let r = 0; r < currentTetromino.matrix.length; r++) {
        for (let c = 0; c < currentTetromino.matrix[r].length; c++) {
          if (currentTetromino.matrix[r][c]) {
            if (currentTetromino.row + r < 0) {
              return showGameOver();
            }
            playfield[currentTetromino.row + r][currentTetromino.col + c] = currentTetromino.name;
          }
        }
      }

      // Check line clears
      let linesCleared = 0;
      for (let r = ROWS - 1; r >= 0; ) {
        if (playfield[r].every(cell => !!cell)) {
          linesCleared++;
          for (let rowAbove = r; rowAbove >= 0; rowAbove--) {
            for (let col = 0; col < COLS; col++) {
              playfield[rowAbove][col] = playfield[rowAbove - 1] ? playfield[rowAbove - 1][col] : 0;
            }
          }
        } else {
          r--;
        }
      }

      if (linesCleared > 0) {
        lines += linesCleared;
        const lineScores = [0, 100, 300, 500, 800];
        score += (lineScores[linesCleared] || 800) * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(12, 40 - (level - 1) * 3);

        document.getElementById('scoreDisplay').innerText = score;
        document.getElementById('linesDisplay').innerText = lines;
        document.getElementById('levelDisplay').innerText = level;
      }

      // Next piece transition
      currentTetromino = {
        name: nextPieceName,
        matrix: tetrominos[nextPieceName],
        row: nextPieceName === 'I' ? -1 : -2,
        col: Math.floor(COLS / 2) - Math.ceil(tetrominos[nextPieceName][0].length / 2)
      };

      if (tetrominoSequence.length === 0) {
        generateSequence();
      }
      nextPieceName = tetrominoSequence.pop();
      drawNextPiece();

      // If initial spawn is blocked -> Game Over
      if (!isValidMove(currentTetromino.matrix, currentTetromino.row, currentTetromino.col)) {
        showGameOver();
      }
    }

    // --- Next Piece Canvas Preview ---
    function drawNextPiece() {
      nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
      if (!nextPieceName) return;

      const matrix = tetrominos[nextPieceName];
      const previewCell = 18;
      const pieceW = matrix[0].length * previewCell;
      const pieceH = matrix.length * previewCell;
      const startX = Math.floor((nextCanvas.width - pieceW) / 2);
      const startY = Math.floor((nextCanvas.height - pieceH) / 2);

      nextContext.fillStyle = getColorForPiece(nextPieceName);
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            nextContext.fillRect(startX + c * previewCell, startY + r * previewCell, previewCell - 1, previewCell - 1);
          }
        }
      }
    }

    // --- Game Over ---
    function showGameOver() {
      cancelAnimationFrame(rAF);
      gameOver = true;
      document.getElementById('finalScore').innerText = score;
      document.getElementById('gameOverOverlay').style.display = 'flex';
    }

    function resetGame() {
      initPlayfield();
      score = 0;
      lines = 0;
      level = 1;
      dropCounter = 0;
      dropInterval = 40;
      gameOver = false;
      document.getElementById('scoreDisplay').innerText = '0';
      document.getElementById('linesDisplay').innerText = '0';
      document.getElementById('levelDisplay').innerText = '1';
      document.getElementById('gameOverOverlay').style.display = 'none';

      generateSequence();
      currentTetromino = getNextPiece();
      nextPieceName = tetrominoSequence.pop();
      drawNextPiece();

      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(loop);
    }

    document.getElementById('restartBtn').addEventListener('click', resetGame);

    // --- Main Game Loop ---
    function loop() {
      if (gameOver) return;
      rAF = requestAnimationFrame(loop);

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background grid lines
      context.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      context.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        context.beginPath();
        context.moveTo(c * grid, 0);
        context.lineTo(c * grid, canvas.height);
        context.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        context.beginPath();
        context.moveTo(0, r * grid);
        context.lineTo(canvas.width, r * grid);
        context.stroke();
      }

      // Draw placed blocks on playfield
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (playfield[r][c]) {
            const name = playfield[r][c];
            context.fillStyle = getColorForPiece(name);
            context.fillRect(c * grid, r * grid, grid - 1, grid - 1);
          }
        }
      }

      // Update & Draw active tetromino
      if (currentTetromino) {
        if (++dropCounter > dropInterval) {
          currentTetromino.row++;
          dropCounter = 0;

          if (!isValidMove(currentTetromino.matrix, currentTetromino.row, currentTetromino.col)) {
            currentTetromino.row--;
            placeTetromino();
          }
        }

        context.fillStyle = getColorForPiece(currentTetromino.name);
        for (let r = 0; r < currentTetromino.matrix.length; r++) {
          for (let c = 0; c < currentTetromino.matrix[r].length; c++) {
            if (currentTetromino.matrix[r][c]) {
              const drawY = (currentTetromino.row + r) * grid;
              const drawX = (currentTetromino.col + c) * grid;
              if (drawY >= 0) {
                context.fillRect(drawX, drawY, grid - 1, grid - 1);
              }
            }
          }
        }
      }
    }

    // --- Controls ---
    function moveLeft() {
      if (gameOver || !currentTetromino) return;
      const col = currentTetromino.col - 1;
      if (isValidMove(currentTetromino.matrix, currentTetromino.row, col)) {
        currentTetromino.col = col;
      }
    }

    function moveRight() {
      if (gameOver || !currentTetromino) return;
      const col = currentTetromino.col + 1;
      if (isValidMove(currentTetromino.matrix, currentTetromino.row, col)) {
        currentTetromino.col = col;
      }
    }

    function rotatePiece() {
      if (gameOver || !currentTetromino) return;
      const matrix = rotate(currentTetromino.matrix);
      if (isValidMove(matrix, currentTetromino.row, currentTetromino.col)) {
        currentTetromino.matrix = matrix;
      } else if (isValidMove(matrix, currentTetromino.row, currentTetromino.col - 1)) {
        // Wall kick left
        currentTetromino.col -= 1;
        currentTetromino.matrix = matrix;
      } else if (isValidMove(matrix, currentTetromino.row, currentTetromino.col + 1)) {
        // Wall kick right
        currentTetromino.col += 1;
        currentTetromino.matrix = matrix;
      }
    }

    function softDrop() {
      if (gameOver || !currentTetromino) return;
      const row = currentTetromino.row + 1;
      if (!isValidMove(currentTetromino.matrix, row, currentTetromino.col)) {
        placeTetromino();
        return;
      }
      currentTetromino.row = row;
      score += 1;
      document.getElementById('scoreDisplay').innerText = score;
    }

    function hardDrop() {
      if (gameOver || !currentTetromino) return;
      while (isValidMove(currentTetromino.matrix, currentTetromino.row + 1, currentTetromino.col)) {
        currentTetromino.row++;
        score += 2;
      }
      document.getElementById('scoreDisplay').innerText = score;
      placeTetromino();
    }

    // Keyboard bindings
    document.addEventListener('keydown', function(e) {
      if (gameOver) return;
      if (e.which === 37 || e.key === 'a' || e.key === 'A') { // Left
        moveLeft();
      } else if (e.which === 39 || e.key === 'd' || e.key === 'D') { // Right
        moveRight();
      } else if (e.which === 38 || e.key === 'w' || e.key === 'W') { // Rotate
        rotatePiece();
      } else if (e.which === 40 || e.key === 's' || e.key === 'S') { // Soft Drop
        softDrop();
      } else if (e.which === 32) { // Hard Drop (Space)
        e.preventDefault();
        hardDrop();
      }
    });

    // Mobile Virtual Touch Buttons
    document.getElementById('btnLeft').addEventListener('click', moveLeft);
    document.getElementById('btnRight').addEventListener('click', moveRight);
    document.getElementById('btnRotate').addEventListener('click', rotatePiece);
    document.getElementById('btnDown').addEventListener('click', softDrop);
    document.getElementById('btnHardDrop').addEventListener('click', hardDrop);

    // --- Window Resize Handling ---
    window.addEventListener('resize', () => {
      const newGrid = calculateGridSize();
      if (newGrid !== grid) {
        grid = newGrid;
        canvas.width = COLS * grid;
        canvas.height = ROWS * grid;
      }
    });

    // --- PostMessage & Session Timer Protocol ---
    let sessionRemainingSec = 20 * 60;
    let timerInterval = setInterval(() => {
      if (sessionRemainingSec > 0) {
        sessionRemainingSec--;
        const mins = Math.floor(sessionRemainingSec / 60);
        const secs = sessionRemainingSec % 60;
        document.getElementById('timerDisplay').innerText = 
          `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }, 1000);

    window.addEventListener('message', function(event) {
      if (!event.data) return;
      if (event.data.leftColor || event.data.rightColor) {
        updateEyeColors(event.data.leftColor, event.data.rightColor);
      }

      window.parent.postMessage("Game Started", "*");

      const sessionDuration = (event.data.time && !isNaN(event.data.time) && event.data.time > 10000) 
        ? event.data.time 
        : (20 * 60 * 1000);

      sessionRemainingSec = Math.floor(sessionDuration / 1000);

      setTimeout(function() {
        clearInterval(timerInterval);
        const message = { msg: 'Game Ended', game: "Tetris", score: score };
        window.parent.postMessage(message, "*");
        console.log('Game ended by Game js timer');
      }, sessionDuration);
    });

    // Start immediately on load
    $(document).ready(function() {
      $(window).focus();
      resetGame();
    });
  </script>
</body>
</html>