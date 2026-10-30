<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Snake Macular Fixation - LazyEye Therapy</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
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
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 8px;
    }

    /* In-HUD embedding optimizations */
    body.in-hud {
      padding: 4px;
    }
    body.in-hud .snake-hud-bar {
      padding: 4px 10px;
      margin-bottom: 4px;
      background: rgba(15, 23, 42, 0.6);
      border-color: rgba(255, 255, 255, 0.05);
    }
    body.in-hud #finishSnakeBtn,
    body.in-hud .snake-brand h1 {
      display: none !important;
    }

    /* Top HUD Bar */
    .snake-hud-bar {
      width: 100%;
      max-width: 820px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 8px 16px;
      margin-bottom: 8px;
      backdrop-filter: blur(8px);
    }

    .snake-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .snake-brand h1 {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #34d399, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .eye-badges {
      display: flex;
      gap: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .eye-badge-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .eye-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 6px currentColor;
    }

    .btn-sound-toggle, .btn-keys-toggle {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #cbd5e1;
      height: 30px;
      padding: 0 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }
    .btn-sound-toggle:active, .btn-keys-toggle:active {
      background: rgba(56, 189, 248, 0.25);
      color: #38bdf8;
    }
    .btn-keys-toggle.active {
      background: rgba(56, 189, 248, 0.2);
      border-color: #38bdf8;
      color: #38bdf8;
    }
    .snake-score-chip {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px 12px;
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Playfield */
    .arena-container {
      position: relative;
      border-radius: 12px;
      padding: 3px;
      background: linear-gradient(135deg, rgba(52, 211, 153, 0.4), rgba(56, 189, 248, 0.4));
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
    }

    canvas#game {
      display: block;
      background: #000000;
      border-radius: 9px;
    }

    /* Mobile On-Screen Controls */
    .mobile-dpad {
      display: none;
      margin-top: 10px;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 220px;
    }

    .dpad-row {
      display: flex;
      gap: 8px;
      width: 100%;
      justify-content: center;
    }

    .btn-dpad {
      width: 54px;
      height: 48px;
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #f8fafc;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: manipulation;
    }

    .btn-dpad:active {
      background: rgba(52, 211, 153, 0.4);
      border-color: #34d399;
    }

    .mobile-dpad {
      display: none;
    }
    .mobile-dpad.show-keys {
      display: flex !important;
    }
    @media (max-width: 768px) {
      .snake-brand h1 {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>

  <!-- Top HUD Bar -->
  <div class="snake-hud-bar">
    <div class="snake-brand">
      <i class="fa-solid fa-staff-snake" style="color: #34d399;"></i>
      <h1>SNAKE FIXATION</h1>
      <div class="eye-badges">
        <div class="eye-badge-item">
          <span class="eye-dot" id="snakeEyeDot" style="color: #ef4444; background: #ef4444;"></span>
          <span>Snake</span>
        </div>
        <div class="eye-badge-item">
          <span class="eye-dot" id="appleEyeDot" style="color: #06b6d4; background: #06b6d4;"></span>
          <span>Target</span>
        </div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 8px;">
      <button type="button" class="btn-sound-toggle" id="snakeAudioToggleBtn" title="Toggle Audio">
        <i class="fa-solid fa-volume-high"></i>
      </button>
      <button type="button" class="btn-keys-toggle" id="snakeKeysToggleBtn" title="Toggle On-Screen Arrow Keys">
        <i class="fa-regular fa-keyboard"></i>
        <span id="keysBtnLabel">Keys</span>
      </button>
    </div>
    <div class="snake-score-chip">
      <span>Score:</span>
      <span id="scoreVal">0</span>
    </div>

    <button id="finishSnakeBtn" style="background:#059669; border:none; color:#fff; border-radius:20px; padding:6px 14px; font-size:12px; font-weight:600; cursor:pointer;">
      <i class="fa-solid fa-floppy-disk me-1"></i> Finish & Save
    </button>
  </div>

  <!-- Main Canvas Playfield -->
  <div class="arena-container">
    <canvas id="game"></canvas>
  </div>

  <!-- Mobile D-Pad -->
  <div class="mobile-dpad">
    <div class="dpad-row">
      <button class="btn-dpad" id="btnUp"><i class="fa-solid fa-arrow-up"></i></button>
    </div>
    <div class="dpad-row">
      <button class="btn-dpad" id="btnLeft"><i class="fa-solid fa-arrow-left"></i></button>
      <button class="btn-dpad" id="btnDown"><i class="fa-solid fa-arrow-down"></i></button>
      <button class="btn-dpad" id="btnRight"><i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>

  <script>
    // Web Audio Synthesizer for Snake
    class SnakeAudio {
      constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('lazyeye_snake_muted') === 'true';
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      toggle() {
        this.muted = !this.muted;
        localStorage.setItem('lazyeye_snake_muted', this.muted);
        this.updateBtn();
        return this.muted;
      }
      updateBtn() {
        const btn = document.getElementById('snakeAudioToggleBtn');
        if (btn) {
          btn.innerHTML = this.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        }
      }
      play(freq, dur = 0.04, type = 'sine', endFreq = null) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + dur);
          gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + dur);
        } catch (e) {}
      }
      turn() { this.play(260, 0.02, 'triangle'); }
      eat() {
        this.play(587, 0.06, 'sine');
        setTimeout(() => this.play(880, 0.1, 'sine'), 50);
      }
      crash() { this.play(180, 0.2, 'sawtooth', 60); }
    }
    const sound = new SnakeAudio();

    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const grid = 20; // 20px grid cells

    // Responsive Canvas Resolution
    function resizeCanvas() {
      const dpadEl = document.querySelector('.mobile-dpad');
      const isDpadActive = dpadEl && dpadEl.classList.contains('show-keys');
      const inHud = window.self !== window.top;
      
      const maxW = Math.min(window.innerWidth - 20, 800);
      const headerOffset = inHud ? 50 : 80;
      const bottomOffset = isDpadActive ? 140 : 20;
      const maxH = Math.min(window.innerHeight - headerOffset - bottomOffset, 650);

      // Snap to multiples of grid
      const w = Math.floor(maxW / grid) * grid;
      const h = Math.floor(maxH / grid) * grid;

      canvas.width = Math.max(260, w);
      canvas.height = Math.max(260, h);
    }

    resizeCanvas();

    // Therapy Dichoptic Colors
    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';
    let snakeColor = leftColor;
    let appleColor = rightColor;

    function updateColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;
      snakeColor = leftColor;
      appleColor = rightColor;

      document.getElementById('snakeEyeDot').style.color = snakeColor;
      document.getElementById('snakeEyeDot').style.background = snakeColor;
      document.getElementById('appleEyeDot').style.color = appleColor;
      document.getElementById('appleEyeDot').style.background = appleColor;
    }

    // Therapy Speed Settings (Doctor Prescribed: Progressive vs Fixed Levels 1-5)
    const urlParams = new URLSearchParams(window.location.search);
    let speedParam = urlParams.get('speed') || 'level-3';

    function getDividerForSpeed(speed) {
      if (speed === 'level-1' || speed === 'slow') return 10; // Level 1: Rehab / Very Slow
      if (speed === 'level-2') return 8; // Level 2: Slow
      if (speed === 'level-4' || speed === 'fast') return 4; // Level 4: Fast
      if (speed === 'level-5') return 3; // Level 5: Agility
      return 10; // Level 3: Relaxed Easy Therapy Default
    }

    let isIncremental = (speedParam === 'progressive' || speedParam === 'incremental');
    let baseSpeedDivider = getDividerForSpeed(speedParam);

    window.addEventListener('message', function(e) {
      if (!e.data) return;
      if (e.data.speedMode) {
        speedParam = e.data.speedMode;
        isIncremental = (speedParam === 'progressive' || speedParam === 'incremental');
        baseSpeedDivider = getDividerForSpeed(speedParam);
      }
    });

    let count = 0;
    let score = 0;
    let isGamePaused = false;

    let snake = {
      x: grid * 5,
      y: grid * 5,
      dx: grid,
      dy: 0,
      cells: [],
      maxCells: 4
    };

    let apple = {
      x: grid * 10,
      y: grid * 10
    };

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function respawnApple() {
      const cols = Math.floor(canvas.width / grid);
      const rows = Math.floor(canvas.height / grid);
      apple.x = getRandomInt(1, cols - 1) * grid;
      apple.y = getRandomInt(1, rows - 1) * grid;
    }

    respawnApple();

    // Direction Queue to prevent instant self-collision
    let nextDx = grid;
    let nextDy = 0;

    function loop() {
      requestAnimationFrame(loop);
      if (isGamePaused) return;

      // Control game speed dynamically based on selected therapy velocity
      let currentDivider = baseSpeedDivider;
      if (isIncremental) {
        currentDivider = Math.max(3, 8 - Math.floor(score / 5));
      }
      if (++count < currentDivider) return;
      count = 0;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle arena grid
      context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      context.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += grid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }
      for (let y = 0; y < canvas.height; y += grid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }

      // Apply queued direction
      snake.dx = nextDx;
      snake.dy = nextDy;

      // Move snake
      snake.x += snake.dx;
      snake.y += snake.dy;

      // Wrap around walls
      if (snake.x < 0) {
        snake.x = canvas.width - grid;
      } else if (snake.x >= canvas.width) {
        snake.x = 0;
      }

      if (snake.y < 0) {
        snake.y = canvas.height - grid;
      } else if (snake.y >= canvas.height) {
        snake.y = 0;
      }

      snake.cells.unshift({ x: snake.x, y: snake.y });

      if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
      }

      // Draw Apple (Right Eye Color)
      context.fillStyle = appleColor;
      context.beginPath();
      const appleRadius = (grid - 2) / 2;
      context.arc(apple.x + grid / 2, apple.y + grid / 2, appleRadius, 0, Math.PI * 2);
      context.fill();

      // Draw Snake (Left Eye Color)
      context.fillStyle = snakeColor;
      snake.cells.forEach((cell, index) => {
        // Head has rounded border or subtle brightness
        if (index === 0) {
          context.fillStyle = snakeColor;
        } else {
          context.fillStyle = snakeColor;
        }
        context.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2);

        // Snake ate Apple
        if (cell.x === apple.x && cell.y === apple.y) {
          snake.maxCells++;
          sound.eat();
          score++;
          window.score = score;
          document.getElementById('scoreVal').innerText = score;
          try { window.parent.postMessage({ score: score }, '*'); } catch (e) {}
          respawnApple();
        }

        // Self-collision detection
        for (let i = index + 1; i < snake.cells.length; i++) {
          if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
            sound.crash();
            // Reset snake
            snake.x = grid * 5;
            snake.y = grid * 5;
            snake.cells = [];
            snake.maxCells = 4;
            snake.dx = grid;
            snake.dy = 0;
            nextDx = grid;
            nextDy = 0;
            respawnApple();
          }
        }
      });
    }

    // Direction input handlers
    function turnUp() { sound.turn();
      if (snake.dy === 0) { nextDx = 0; nextDy = -grid; }
    }
    function turnDown() { sound.turn();
      if (snake.dy === 0) { nextDx = 0; nextDy = grid; }
    }
    function turnLeft() { sound.turn();
      if (snake.dx === 0) { nextDx = -grid; nextDy = 0; }
    }
    function turnRight() { sound.turn();
      if (snake.dx === 0) { nextDx = grid; nextDy = 0; }
    }

    // Keyboard events
    document.addEventListener('keydown', function(e) {
      if (e.which === 37 || e.key === 'a' || e.key === 'A') turnLeft();
      else if (e.which === 38 || e.key === 'w' || e.key === 'W') turnUp();
      else if (e.which === 39 || e.key === 'd' || e.key === 'D') turnRight();
      else if (e.which === 40 || e.key === 's' || e.key === 'S') turnDown();
    });

    // Mobile D-Pad buttons
    document.getElementById('btnUp').addEventListener('click', turnUp);
    document.getElementById('btnDown').addEventListener('click', turnDown);
    document.getElementById('btnLeft').addEventListener('click', turnLeft);
    document.getElementById('btnRight').addEventListener('click', turnRight);

    // Touch screen detection
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const dpad = document.querySelector('.mobile-dpad');
    const keysBtn = document.getElementById('snakeKeysToggleBtn');

    // Only show on-screen keys if touch is NOT available, or if user explicitly toggles keys
    let showKeys = !isTouchDevice;
    function updateKeysVisibility() {
      if (dpad) {
        if (showKeys) {
          dpad.classList.add('show-keys');
          if (keysBtn) keysBtn.classList.add('active');
        } else {
          dpad.classList.remove('show-keys');
          if (keysBtn) keysBtn.classList.remove('active');
        }
        resizeCanvas();
      }
    }
    updateKeysVisibility();

    if (keysBtn) {
      keysBtn.addEventListener('click', () => {
        showKeys = !showKeys;
        updateKeysVisibility();
      });
    }

    // Fluid Touch Slide to Move (Listens across the whole play arena)
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    const touchArea = document.querySelector('.arena-container') || canvas;

    window.addEventListener('touchstart', function(e) {
      if (e.target.closest('.mobile-dpad') || e.target.closest('button')) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
      if (!isSwiping || e.target.closest('.mobile-dpad') || e.target.closest('button')) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartX;
      const dy = currentY - touchStartY;
      const threshold = 18; // Low threshold for instant responsive turns

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) turnRight();
          else turnLeft();
        } else {
          if (dy > 0) turnDown();
          else turnUp();
        }
        // Reset anchor point to enable continuous smooth gliding turns
        touchStartX = currentX;
        touchStartY = currentY;
      }
    }, { passive: false });

    window.addEventListener('touchend', function() {
      isSwiping = false;
    }, { passive: true });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    // Parent postMessage Communication
    window.addEventListener('message', function(event) {
      if (!event.data) return;
      if (event.data.paused !== undefined) {
        isGamePaused = !!event.data.paused;
      }
      if (event.data.leftColor || event.data.rightColor) {
        updateColors(event.data.leftColor, event.data.rightColor);
      }

      window.parent.postMessage("Game Started", "*");

      const sessionDuration = (event.data.time && !isNaN(event.data.time) && event.data.time > 10000)
        ? event.data.time
        : (20 * 60 * 1000);

      setTimeout(function() {
        reportSession();
        console.log('Game ended by Game js timer');
      }, sessionDuration);
    });

    function reportSession() {
      const message = { msg: 'Game Ended', game: 'Snake', score: score };
      window.parent.postMessage(message, "*");
    }

    window.reportGameSession = reportSession;
    window.currentSession = {
      game: 'Snake',
      getScore: function() { return score; }
    };

    $(document).ready(function() {
      $(window).focus();
      if (window.self !== window.top) {
        document.body.classList.add('in-hud');
      }
      resizeCanvas();
      updateColors(leftColor, rightColor);
      requestAnimationFrame(loop);

      document.getElementById('finishSnakeBtn')?.addEventListener('click', reportSession);
    });
  </script>
</body>
</html>