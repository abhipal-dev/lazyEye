<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Flappy Bird Dual-Eye Flight - LazyEye Therapy</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }

    :root {
      --first-pipe-bg-color: #ef4444;
      --second-pipe-bg-color: #06b6d4;
    }

    body {
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .game-stage {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .background {
      background-image: url('images/flappy_bird_background.png');
      height: 100%;
      width: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 0;
    }

    .bird {
      height: 48px;
      width: 48px;
      position: absolute;
      top: 40vh;
      left: 20vw;
      z-index: 10;
      transition: transform 0.1s ease;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
    }

    .pipe_sprite {
      position: absolute;
      width: 64px;
      z-index: 5;
      border-radius: 6px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    }

    .left_color {
      background-color: var(--first-pipe-bg-color);
    }

    .right_color {
      background-color: var(--second-pipe-bg-color);
    }

    /* Modern Top HUD Bar */
    .top-hud {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      padding: 8px 20px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    }

    .eye-legend {
      display: flex;
      gap: 12px;
      font-size: 11px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .eye-legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .eye-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .score-badge {
      font-size: 16px;
      font-weight: 800;
      color: #facc15;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Modal Screens */
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      z-index: 40;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }

    .modal-card {
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 28px 36px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      max-width: 380px;
      width: 100%;
    }

    .modal-card h2 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .modal-card p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .btn-action {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(2, 132, 199, 0.4);
      transition: transform 0.15s ease;
    }

    .btn-action:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>

  <div class="game-stage" id="stage">
    <div class="background"></div>
    <img class="bird" id="bird" src="images/flappy_bird1.png" alt="bird">

    <!-- Top Status HUD -->
    <div class="top-hud">
      <div class="eye-legend">
        <div class="eye-legend-item">
          <span class="eye-dot" id="dotLeft" style="background: var(--first-pipe-bg-color);"></span>
          <span>Left Eye</span>
        </div>
        <div class="eye-legend-item">
          <span class="eye-dot" id="dotRight" style="background: var(--second-pipe-bg-color);"></span>
          <span>Right Eye</span>
        </div>
      </div>
      <div class="score-badge">
        <i class="fa-solid fa-trophy"></i>
        <span>Score:</span>
        <span id="scoreVal">0</span>
      </div>
    </div>

    <!-- Start / Game Over Modal -->
    <div class="modal-overlay" id="gameModal">
      <div class="modal-card">
        <h2 id="modalTitle">FLAPPY BIRD</h2>
        <p id="modalDesc">Dichoptic dual-eye altitude training. Tap screen or press Space / Up Arrow to flap.</p>
        <button class="btn-action" id="startBtn">START GAME</button>
      </div>
    </div>
  </div>

  <script>
    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';
    let score = 0;
    let game_state = 'Start';
    let move_speed = 3.5;
    let gravity = 0.45;
    let bird_dy = 0;
    let pipe_separation = 0;
    let pipe_gap = 180; // pixels gap
    let toggle_color = 0;

    const bird = document.getElementById('bird');
    const stage = document.getElementById('stage');
    const scoreVal = document.getElementById('scoreVal');
    const gameModal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const startBtn = document.getElementById('startBtn');

    function updateColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;
      const root = document.querySelector(':root');
      root.style.setProperty('--first-pipe-bg-color', leftColor);
      root.style.setProperty('--second-pipe-bg-color', rightColor);
      document.getElementById('dotLeft').style.background = leftColor;
      document.getElementById('dotRight').style.background = rightColor;
    }

    function flap() {
      if (game_state === 'Play') {
        bird_dy = -7.2;
        bird.style.transform = 'rotate(-20deg)';
      }
    }

    // Single unified keydown handler
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (game_state === 'Start' || game_state === 'End') {
          startGame();
        } else {
          flap();
        }
      } else if (e.key === 'Enter') {
        if (game_state === 'Start' || game_state === 'End') {
          startGame();
        }
      }
    });

    // Touch and click anywhere on stage to flap
    stage.addEventListener('pointerdown', (e) => {
      if (game_state === 'Play') {
        e.preventDefault();
        flap();
      }
    });

    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startGame();
    });

    function startGame() {
      document.querySelectorAll('.pipe_sprite').forEach(el => el.remove());
      bird.style.top = '40vh';
      bird_dy = 0;
      score = 0;
      scoreVal.innerText = '0';
      game_state = 'Play';
      gameModal.style.display = 'none';
      pipe_separation = 0;
      requestAnimationFrame(gameLoop);
    }

    function endGame() {
      game_state = 'End';
      modalTitle.innerText = 'GAME OVER';
      modalDesc.innerHTML = `Final Score: <strong style="color: #facc15; font-size: 18px;">${score}</strong><br>Tap below to try again.`;
      startBtn.innerText = 'PLAY AGAIN';
      gameModal.style.display = 'flex';
    }

    function gameLoop() {
      if (game_state !== 'Play') return;

      const stageRect = stage.getBoundingClientRect();
      const birdRect = bird.getBoundingClientRect();

      // Apply gravity
      bird_dy += gravity;
      let newTop = bird.offsetTop + bird_dy;

      // Rotate bird according to velocity
      if (bird_dy > 2) {
        bird.style.transform = 'rotate(25deg)';
      }

      // Ceiling & Floor Collision
      if (newTop <= 0 || newTop + birdRect.height >= stageRect.height) {
        endGame();
        return;
      }
      bird.style.top = newTop + 'px';

      // Move & Collide Pipes
      const pipes = document.querySelectorAll('.pipe_sprite');
      pipes.forEach(pipe => {
        const pipeRect = pipe.getBoundingClientRect();

        // Offscreen removal
        if (pipeRect.right <= 0) {
          pipe.remove();
          return;
        }

        // AABB Collision Detection
        if (
          birdRect.left < pipeRect.right &&
          birdRect.right > pipeRect.left &&
          birdRect.top < pipeRect.bottom &&
          birdRect.bottom > pipeRect.top
        ) {
          endGame();
          return;
        }

        // Score increment on passing
        if (pipe.increase_score === '1' && pipeRect.right < birdRect.left) {
          score++;
          scoreVal.innerText = score;
          pipe.increase_score = '0';
        }

        pipe.style.left = (pipe.offsetLeft - move_speed) + 'px';
      });

      // Spawn new pipes
      pipe_separation++;
      if (pipe_separation > 110) {
        pipe_separation = 0;
        spawnPipes(stageRect);
      }

      requestAnimationFrame(gameLoop);
    }

    function spawnPipes(stageRect) {
      const minPipeH = 60;
      const maxPipeH = stageRect.height - pipe_gap - minPipeH;
      const topPipeH = Math.floor(Math.random() * (maxPipeH - minPipeH)) + minPipeH;
      const bottomPipeH = stageRect.height - topPipeH - pipe_gap;

      // Dichoptic alternating pipe colors
      const pipeClass = toggle_color === 0 ? 'left_color' : 'right_color';
      toggle_color = toggle_color === 0 ? 1 : 0;

      // Top pipe
      const topPipe = document.createElement('div');
      topPipe.className = `pipe_sprite ${pipeClass}`;
      topPipe.style.top = '0px';
      topPipe.style.height = topPipeH + 'px';
      topPipe.style.left = stageRect.width + 'px';
      stage.appendChild(topPipe);

      // Bottom pipe
      const bottomPipe = document.createElement('div');
      bottomPipe.className = `pipe_sprite ${pipeClass}`;
      bottomPipe.style.bottom = '0px';
      bottomPipe.style.height = bottomPipeH + 'px';
      bottomPipe.style.left = stageRect.width + 'px';
      bottomPipe.increase_score = '1';
      stage.appendChild(bottomPipe);
    }

    // PostMessage Protocol
    window.addEventListener('message', function(event) {
      if (!event.data) return;
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
      const message = { msg: 'Game Ended', game: 'Flappy Bird', score: score };
      window.parent.postMessage(message, "*");
    }

    window.reportGameSession = reportSession;
    window.currentSession = {
      game: 'Flappy Bird',
      getScore: function() { return score; }
    };

    $(document).ready(function() {
      $(window).focus();
      updateColors(leftColor, rightColor);
    });
  </script>
</body>
</html>
