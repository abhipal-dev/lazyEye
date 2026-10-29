<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Tetris Therapy - LazyEye</title>
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
      background: #090d16;
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      min-height: 100dvh;
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
      gap: 20px;
      max-width: 900px;
      width: 100%;
    }

    /* Compact Mobile Top Bar (Hidden on desktop) */
    .mobile-top-bar {
      display: none;
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
      padding: 3px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.8);
    }

    canvas#game {
      display: block;
      background: #000000;
      border-radius: 7px;
      touch-action: none;
    }

    /* Sidebar HUD (Desktop) */
    .hud-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 230px;
    }

    .hud-title-box {
      background: rgba(17, 24, 39, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }

    .hud-title-box h1 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #38bdf8;
      margin-bottom: 2px;
    }

    .hud-title-box p {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Dichoptic Eye Indicator */
    .therapy-status-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.8);
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
      font-size: 11px;
    }

    .eye-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 6px currentColor;
    }

    /* Next Piece Card */
    .next-card {
      background: rgba(17, 24, 39, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hud-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    canvas#nextCanvas {
      background: #030712;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .stat-card {
      background: rgba(17, 24, 39, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px;
      text-align: center;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 800;
      color: #38bdf8;
      font-variant-numeric: tabular-nums;
      margin-top: 2px;
    }

    /* Audio Toggle Button */
    .btn-audio-toggle {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: #cbd5e1;
      padding: 4px 8px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease;
    }

    .btn-audio-toggle:active {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
    }

    /* Controls Guide */
    .controls-guide {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 11px;
      color: #94a3b8;
    }

    .controls-guide div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }

    .key-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 1px 5px;
      border-radius: 4px;
      color: #f1f5f9;
      font-family: monospace;
      font-size: 10px;
    }

    /* Mobile Virtual Controls */
    .mobile-controls {
      display: none;
      margin-top: 6px;
      width: 100%;
      max-width: 320px;
      gap: 6px;
    }

    .dpad-row {
      display: flex;
      justify-content: center;
      gap: 8px;
      width: 100%;
    }

    .btn-virtual {
      background: rgba(30, 41, 59, 0.95);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      height: 44px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    }

    .btn-virtual:active {
      background: rgba(56, 189, 248, 0.3);
      border-color: #38bdf8;
      transform: scale(0.96);
    }

    .btn-hard-drop {
      background: rgba(239, 68, 68, 0.25);
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
      background: rgba(3, 7, 18, 0.9);
      border-radius: 7px;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 20;
      padding: 16px;
      text-align: center;
    }

    .game-over-overlay h2 {
      font-size: 22px;
      font-weight: 800;
      color: #ef4444;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .game-over-overlay p {
      font-size: 13px;
      color: #cbd5e1;
      margin-bottom: 14px;
    }

    .btn-restart {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-restart:hover {
      background: #1d4ed8;
    }

    /* Mobile Screen Adaptation (Standard responsive layout) */
    @media (max-width: 768px) {
      body {
        padding: 4px;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
      }

      .tetris-arcade-wrap {
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 100%;
        max-width: 100%;
      }

      /* Compact Top Bar on Mobile */
      .mobile-top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 320px;
        height: 38px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 4px 10px;
        margin-bottom: 4px;
      }

      .mobile-stat-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.1;
      }

      .mobile-stat-box .m-label {
        font-size: 9px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
      }

      .mobile-stat-box .m-val {
        font-size: 14px;
        font-weight: 800;
        color: #38bdf8;
        font-variant-numeric: tabular-nums;
      }

      .mobile-next-box {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      canvas#mobileNextCanvas {
        background: #030712;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .mobile-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .btn-mini-action {
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
        border-radius: 6px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
      }

      .hud-panel {
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
    <!-- Compact Mobile Status Header -->
    <div class="mobile-top-bar">
      <div class="mobile-stat-box">
        <span class="m-label">Score</span>
        <span class="m-val" id="mobileScoreDisplay">0</span>
      </div>
      <div class="mobile-stat-box">
        <span class="m-label">Lvl</span>
        <span class="m-val" id="mobileLevelDisplay">1</span>
      </div>
      <div class="mobile-next-box">
        <canvas id="mobileNextCanvas" width="40" height="30"></canvas>
      </div>
      <div class="mobile-actions">
        <button type="button" class="btn-mini-action" id="mobileAudioToggleBtn" title="Toggle Sound">
          <i class="fa-solid fa-volume-high"></i>
        </button>
        <button type="button" class="btn-mini-action" id="mobileSaveExitBtn" title="Save & Exit" style="background:#059669; color:#fff; border-color:#10b981;">
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
    </div>

    <!-- Playfield Panel -->
    <div class="playfield-panel">
      <div class="canvas-border-glow">
        <canvas id="game"></canvas>
        <div id="gameOverOverlay" class="game-over-overlay">
          <h2>GAME OVER</h2>
          <p>Score: <span id="finalScore">0</span></p>
          <div style="display:flex; gap:8px;">
            <button id="restartBtn" class="btn-restart"><i class="fa-solid fa-rotate-right"></i> Play Again</button>
            <button id="saveExitBtn" class="btn-restart" style="background:#059669;"><i class="fa-solid fa-floppy-disk"></i> Save & Exit</button>
          </div>
        </div>
      </div>

      <!-- Mobile Touch Controls -->
      <div class="mobile-controls">
        <div class="dpad-row">
          <button class="btn-virtual" id="btnRotate"><i class="fa-solid fa-rotate"></i> ROTATE</button>
          <button class="btn-virtual btn-hard-drop" id="btnHardDrop"><i class="fa-solid fa-angles-down"></i> DROP</button>
        </div>
        <div class="dpad-row">
          <button class="btn-virtual" id="btnLeft"><i class="fa-solid fa-arrow-left"></i></button>
          <button class="btn-virtual" id="btnDown"><i class="fa-solid fa-arrow-down"></i></button>
          <button class="btn-virtual" id="btnRight"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>

    <!-- Desktop HUD Sidebar -->
    <div class="hud-panel">
      <div class="hud-title-box">
        <h1>TETRIS</h1>
        <p>Binocular Therapy</p>
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
        <button type="button" class="btn-audio-toggle" id="desktopAudioToggleBtn" title="Toggle Sound FX">
          <i class="fa-solid fa-volume-high"></i>
        </button>
      </div>

      <!-- Next Piece Preview -->
      <div class="next-card">
        <span class="hud-label">NEXT PIECE</span>
        <canvas id="nextCanvas" width="100" height="75"></canvas>
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

      <button id="finishSessionBtn" class="btn-restart" style="width:100%; margin-top:8px; background:#059669; font-size:12px; padding:8px 12px; justify-content:center;">
        <i class="fa-solid fa-floppy-disk me-1"></i> Finish & Save
      </button>
    </div>
  </div>

  <script>
    // --- Web Audio Synthesizer (No external asset lag) ---
    class GameAudio {
      constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('lazyeye_tetris_muted') === 'true';
      }

      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      toggle() {
        this.muted = !this.muted;
        localStorage.setItem('lazyeye_tetris_muted', this.muted);
        this.updateButtons();
        return this.muted;
      }

      updateButtons() {
        const iconClass = this.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        const desktopBtn = document.getElementById('desktopAudioToggleBtn');
        const mobileBtn = document.getElementById('mobileAudioToggleBtn');
        if (desktopBtn) desktopBtn.innerHTML = `<i class="${iconClass}"></i>`;
        if (mobileBtn) mobileBtn.innerHTML = `<i class="${iconClass}"></i>`;
      }

      playTone(freq, duration = 0.04, type = 'sine', endFreq = null) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          if (endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
          }
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      }

      move() { this.playTone(220, 0.03, 'triangle'); }
      rotate() { this.playTone(420, 0.04, 'sine', 600); }
      drop() { this.playTone(140, 0.06, 'triangle', 70); }
      clear() {
        this.playTone(523, 0.08, 'sine');
        setTimeout(() => this.playTone(659, 0.08, 'sine'), 50);
        setTimeout(() => this.playTone(784, 0.12, 'sine'), 100);
      }
      gameOver() { this.playTone(280, 0.25, 'sawtooth', 100); }
    }

    const sound = new GameAudio();

    // --- Canvas Setup & Responsive Proportions ---
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('nextCanvas');
    const nextContext = nextCanvas.getContext('2d');
    const mobileNextCanvas = document.getElementById('mobileNextCanvas');
    const mobileNextContext = mobileNextCanvas ? mobileNextCanvas.getContext('2d') : null;

    const COLS = 10;
    const ROWS = 20;

    function calculateGridSize() {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Strict mobile vertical budget: topbar (38px) + controls (100px) + margins (25px) = 163px
        const availH = window.innerHeight - 165;
        const availW = window.innerWidth - 20;
        const gridH = Math.floor(availH / ROWS);
        const gridW = Math.floor(availW / COLS);
        return Math.max(14, Math.min(26, Math.min(gridH, gridW)));
      } else {
        const availH = window.innerHeight - 80;
        const calculated = Math.floor(availH / ROWS);
        return Math.max(22, Math.min(32, calculated));
      }
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

    const urlParams = new URLSearchParams(window.location.search);
    let speedParam = urlParams.get('speed') || 'level-3';

    function getDropIntervalForSpeed(speed) {
      if (speed === 'level-1' || speed === 'slow') return 60;
      if (speed === 'level-2') return 48;
      if (speed === 'level-4' || speed === 'fast') return 28;
      if (speed === 'level-5') return 18;
      return 38;
    }

    let isIncremental = (speedParam === 'progressive' || speedParam === 'incremental');
    let baseDropInterval = getDropIntervalForSpeed(speedParam);
    let dropInterval = baseDropInterval;
    let dropCounter = 0;

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
      const leftDot = document.getElementById('leftDot');
      const rightDot = document.getElementById('rightDot');
      if (leftDot) { leftDot.style.color = leftColor; leftDot.style.background = leftColor; }
      if (rightDot) { rightDot.style.color = rightColor; rightDot.style.background = rightColor; }
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

    const tetrominoSequence = [];
    const playfield = [];

    for (let row = -2; row < ROWS; row++) {
      playfield[row] = [];
      for (let col = 0; col < COLS; col++) {
        playfield[row][col] = 0;
      }
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
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

    function getNextTetromino() {
      if (tetrominoSequence.length === 0) {
        generateSequence();
      }
      const name = nextPieceName || tetrominoSequence.pop();
      if (tetrominoSequence.length === 0) {
        generateSequence();
      }
      nextPieceName = tetrominoSequence.pop();
      drawNextPiece();

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

    let currentTetromino = null;

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

      let linesCleared = 0;
      for (let row = ROWS - 1; row >= 0; ) {
        if (playfield[row].every(cell => !!cell)) {
          linesCleared++;
          for (let r = row; r >= 0; r--) {
            for (let c = 0; c < COLS; c++) {
              playfield[r][c] = playfield[r - 1] ? playfield[r - 1][c] : 0;
            }
          }
        } else {
          row--;
        }
      }

      if (linesCleared > 0) {
        sound.clear();
        lines += linesCleared;
        const lineScores = { 1: 100, 2: 300, 3: 500, 4: 800 };
        score += (lineScores[linesCleared] || 800) * level;

        level = Math.floor(lines / 10) + 1;
        if (isIncremental) {
          dropInterval = Math.max(12, baseDropInterval - (level - 1) * 3);
        }

        updateHUD();
      }

      currentTetromino = getNextTetromino();
    }

    function updateHUD() {
      window.score = score;
      document.getElementById('scoreDisplay').innerText = score;
      document.getElementById('linesDisplay').innerText = lines;
      document.getElementById('levelDisplay').innerText = level;
      const mScore = document.getElementById('mobileScoreDisplay');
      const mLvl = document.getElementById('mobileLevelDisplay');
      if (mScore) mScore.innerText = score;
      if (mLvl) mLvl.innerText = level;
      try { window.parent.postMessage({ score: score }, '*'); } catch (e) {}
    }

    // --- Next Piece Preview Rendering ---
    function drawNextPiece() {
      // Desktop Preview
      nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
      if (nextPieceName) {
        const matrix = tetrominos[nextPieceName];
        const previewCell = 16;
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

      // Mobile Preview
      if (mobileNextContext && nextPieceName) {
        mobileNextContext.clearRect(0, 0, mobileNextCanvas.width, mobileNextCanvas.height);
        const matrix = tetrominos[nextPieceName];
        const mCell = 7;
        const pW = matrix[0].length * mCell;
        const pH = matrix.length * mCell;
        const sX = Math.floor((mobileNextCanvas.width - pW) / 2);
        const sY = Math.floor((mobileNextCanvas.height - pH) / 2);

        mobileNextContext.fillStyle = getColorForPiece(nextPieceName);
        for (let r = 0; r < matrix.length; r++) {
          for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
              mobileNextContext.fillRect(sX + c * mCell, sY + r * mCell, mCell - 1, mCell - 1);
            }
          }
        }
      }
    }

    // --- Game Over ---
    function showGameOver() {
      cancelAnimationFrame(rAF);
      gameOver = true;
      sound.gameOver();
      document.getElementById('finalScore').innerText = score;
      document.getElementById('gameOverOverlay').style.display = 'flex';
      try {
        window.parent.postMessage({ score: score, msg: 'Tetris Game Over' }, '*');
      } catch (e) {}
    }

    function resetGame() {
      cancelAnimationFrame(rAF);
      for (let r = -2; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          playfield[r][c] = 0;
        }
      }
      tetrominoSequence.length = 0;
      nextPieceName = null;
      score = 0;
      lines = 0;
      level = 1;
      gameOver = false;
      dropInterval = baseDropInterval;
      dropCounter = 0;

      updateHUD();
      document.getElementById('gameOverOverlay').style.display = 'none';

      currentTetromino = getNextTetromino();
      rAF = requestAnimationFrame(loop);
    }

    // --- Main Game Loop ---
    function loop() {
      rAF = requestAnimationFrame(loop);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      context.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      context.lineWidth = 1;
      for (let r = 0; r < ROWS; r++) {
        context.beginPath();
        context.moveTo(0, r * grid);
        context.lineTo(canvas.width, r * grid);
        context.stroke();
      }
      for (let c = 0; c < COLS; c++) {
        context.beginPath();
        context.moveTo(c * grid, 0);
        context.lineTo(c * grid, canvas.height);
        context.stroke();
      }

      // Draw settled blocks
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
        sound.move();
      }
    }

    function moveRight() {
      if (gameOver || !currentTetromino) return;
      const col = currentTetromino.col + 1;
      if (isValidMove(currentTetromino.matrix, currentTetromino.row, col)) {
        currentTetromino.col = col;
        sound.move();
      }
    }

    function rotatePiece() {
      if (gameOver || !currentTetromino) return;
      const matrix = rotate(currentTetromino.matrix);
      if (isValidMove(matrix, currentTetromino.row, currentTetromino.col)) {
        currentTetromino.matrix = matrix;
        sound.rotate();
      } else if (isValidMove(matrix, currentTetromino.row, currentTetromino.col - 1)) {
        currentTetromino.col -= 1;
        currentTetromino.matrix = matrix;
        sound.rotate();
      } else if (isValidMove(matrix, currentTetromino.row, currentTetromino.col + 1)) {
        currentTetromino.col += 1;
        currentTetromino.matrix = matrix;
        sound.rotate();
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
      updateHUD();
      sound.move();
    }

    function hardDrop() {
      if (gameOver || !currentTetromino) return;
      while (isValidMove(currentTetromino.matrix, currentTetromino.row + 1, currentTetromino.col)) {
        currentTetromino.row++;
        score += 2;
      }
      updateHUD();
      sound.drop();
      placeTetromino();
    }

    // Keyboard bindings
    document.addEventListener('keydown', function(e) {
      if (gameOver) return;
      if (e.which === 37 || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.which === 39 || e.key === 'd' || e.key === 'D') {
        moveRight();
      } else if (e.which === 38 || e.key === 'w' || e.key === 'W') {
        rotatePiece();
      } else if (e.which === 40 || e.key === 's' || e.key === 'S') {
        softDrop();
      } else if (e.which === 32) {
        e.preventDefault();
        hardDrop();
      }
    });

    // Mobile Virtual Touch Buttons (Fast pointerdown, no tap delay)
    function bindVirtualBtn(id, action) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        sound.init();
        action();
      });
    }

    bindVirtualBtn('btnLeft', moveLeft);
    bindVirtualBtn('btnRight', moveRight);
    bindVirtualBtn('btnRotate', rotatePiece);
    bindVirtualBtn('btnDown', softDrop);
    bindVirtualBtn('btnHardDrop', hardDrop);

    // Touch Swipe Gestures on Canvas
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    canvas.addEventListener('touchstart', function(e) {
      if (gameOver) return;
      sound.init();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    canvas.addEventListener('touchend', function(e) {
      if (gameOver) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dt = Date.now() - touchStartTime;

      if (dt < 250 && Math.abs(dx) < 15 && Math.abs(dy) < 15) {
        rotatePiece();
        return;
      }

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 25) {
        if (dx > 0) moveRight();
        else moveLeft();
      } else if (dy > 30) {
        softDrop();
      }
    }, { passive: true });

    // Audio Toggles
    const toggleAudio = (e) => {
      e.preventDefault();
      sound.toggle();
    };
    document.getElementById('desktopAudioToggleBtn')?.addEventListener('click', toggleAudio);
    document.getElementById('mobileAudioToggleBtn')?.addEventListener('click', toggleAudio);
    sound.updateButtons();

    // Window Resize Handling
    window.addEventListener('resize', () => {
      const newGrid = calculateGridSize();
      if (newGrid !== grid) {
        grid = newGrid;
        canvas.width = COLS * grid;
        canvas.height = ROWS * grid;
      }
    });

    // Session Timer
    let sessionRemainingSec = 20 * 60;
    let timerInterval = setInterval(() => {
      if (sessionRemainingSec > 0) {
        sessionRemainingSec--;
        const mins = Math.floor(sessionRemainingSec / 60);
        const secs = sessionRemainingSec % 60;
        const disp = document.getElementById('timerDisplay');
        if (disp) {
          disp.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      }
    }, 1000);

    function reportSession() {
      clearInterval(timerInterval);
      const message = { msg: 'Game Ended', game: "Tetris", score: score };
      window.parent.postMessage(message, "*");
    }

    window.reportGameSession = reportSession;
    window.currentSession = {
      game: 'Tetris',
      getScore: function() { return score; }
    };

    $(document).ready(function() {
      $(window).focus();
      resetGame();

      document.getElementById('finishSessionBtn')?.addEventListener('click', reportSession);
      document.getElementById('saveExitBtn')?.addEventListener('click', reportSession);
      document.getElementById('mobileSaveExitBtn')?.addEventListener('click', reportSession);
      document.getElementById('restartBtn')?.addEventListener('click', resetGame);
    });
  </script>
</body>
</html>
