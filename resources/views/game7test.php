<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Bouncing Ball Agility - LazyEye Therapy</title>
  <script src="https://code.jquery.com/jquery-3.6.3.min.js" crossorigin="anonymous"></script>
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
      --character-bg-color: #ef4444;
      --obstacle-bg-color: #06b6d4;
      --ground-bg-color: #06b6d4;
    }

    body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      position: relative;
    }

    /* Top HUD */
    .runner-hud {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 8px 20px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    .eye-legend {
      display: flex;
      gap: 12px;
      font-size: 11px;
      font-weight: 600;
      color: #f1f5f9;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .eye-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .score-badge {
      font-size: 16px;
      font-weight: 800;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Ground */
    #ground {
      width: 100%;
      height: 90px;
      background-color: var(--ground-bg-color);
      position: absolute;
      bottom: 0;
      left: 0;
      box-shadow: 0 -4px 20px rgba(6, 182, 212, 0.3);
    }

    /* Character Ball */
    #character {
      width: 48px;
      height: 48px;
      background-color: var(--character-bg-color);
      border-radius: 50%;
      position: absolute;
      bottom: 90px;
      left: 80px;
      box-shadow: 0 0 15px currentColor;
      transition: transform 0.05s linear;
      z-index: 20;
    }

    /* Obstacles */
    .obstacle {
      position: absolute;
      bottom: 90px;
      width: 28px;
      background-color: var(--obstacle-bg-color);
      border-radius: 6px 6px 0 0;
      box-shadow: 0 0 10px currentColor;
      z-index: 10;
    }

    .jump-prompt {
      position: absolute;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>

  <!-- Top Status HUD -->
  <div class="runner-hud">
    <div class="eye-legend">
      <div class="legend-item">
        <span class="eye-dot" id="dotLeft" style="background: var(--character-bg-color);"></span>
        <span>Jumping Ball (Left Eye)</span>
      </div>
      <div class="legend-item">
        <span class="eye-dot" id="dotRight" style="background: var(--obstacle-bg-color);"></span>
        <span>Hurdles & Ground (Right Eye)</span>
      </div>
    </div>
    <div class="score-badge">
      <i class="fa-solid fa-star"></i>
      <span>Score:</span>
      <span id="scoreVal">0</span>
    </div>
  </div>

  <div class="jump-prompt">Tap Screen or Press Space / Up Arrow to Jump</div>

  <div id="character"></div>
  <div class="obstacles-container"></div>
  <div id="ground"></div>

  <script>
    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';
    let score = 0;
    let isJumping = false;
    let characterY = 90; // bottom in px
    let groundHeight = 90;
    let jumpVelocity = 0;
    const gravity = 0.6;
    let animId = null;

    const character = document.getElementById('character');
    const scoreVal = document.getElementById('scoreVal');
    const obstaclesContainer = document.querySelector('.obstacles-container');

    function updateColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;

      const root = document.querySelector(':root');
      root.style.setProperty('--character-bg-color', leftColor);
      root.style.setProperty('--obstacle-bg-color', rightColor);
      root.style.setProperty('--ground-bg-color', rightColor);

      document.getElementById('dotLeft').style.background = leftColor;
      document.getElementById('dotRight').style.background = rightColor;
    }

    function jump() {
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 14;
      }
    }

    // Input handlers: Space, Up Arrow, Click, Touch
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      }
    });

    window.addEventListener('pointerdown', (e) => {
      jump();
    });

    // Main Game Loop for Character Physics
    function gameLoop() {
      if (isJumping) {
        characterY += jumpVelocity;
        jumpVelocity -= gravity;

        if (characterY <= groundHeight) {
          characterY = groundHeight;
          isJumping = false;
          jumpVelocity = 0;
        }
        character.style.bottom = characterY + 'px';
      }

      animId = requestAnimationFrame(gameLoop);
    }

    // Obstacle Generator
    let obstacles = [];
    let spawnTimer = null;

    function spawnObstacle() {
      const obstacleEl = document.createElement('div');
      obstacleEl.className = 'obstacle';
      const h = Math.floor(Math.random() * 45) + 40;
      obstacleEl.style.height = h + 'px';
      obstacleEl.style.left = window.innerWidth + 'px';
      obstaclesContainer.appendChild(obstacleEl);

      obstacles.push({
        el: obstacleEl,
        x: window.innerWidth,
        width: 28,
        height: h,
        cleared: false
      });

      const nextInterval = Math.floor(Math.random() * 800) + 1600;
      spawnTimer = setTimeout(spawnObstacle, nextInterval);
    }

    // Obstacle Movement & Collision Loop
    let obstacleSpeed = 5;
    setInterval(() => {
      const charLeft = 80;
      const charRight = 80 + 48;
      const charBottom = characterY;

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obstacleSpeed;
        obs.el.style.left = obs.x + 'px';

        // Collision Check (AABB)
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = groundHeight + obs.height;

        if (charRight > obsLeft && charLeft < obsRight && charBottom < obsTop) {
          // Soft collision: flash red and reset score slightly
          character.style.opacity = '0.4';
          setTimeout(() => { character.style.opacity = '1'; }, 200);
          score = Math.max(0, score - 2);
          scoreVal.innerText = score;
        }

        // Passed obstacle: award score
        if (!obs.cleared && obsRight < charLeft) {
          obs.cleared = true;
          score += 5;
          scoreVal.innerText = score;
        }

        // Offscreen removal
        if (obs.x < -40) {
          obs.el.remove();
          obstacles.splice(i, 1);
        }
      }
    }, 20);

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
        const message = { msg: 'Game Ended', game: 'Bouncing Ball', score: score };
        window.parent.postMessage(message, "*");
        console.log('Game ended by Game js timer');
      }, sessionDuration);
    });

    $(document).ready(function() {
      $(window).focus();
      updateColors(leftColor, rightColor);
      requestAnimationFrame(gameLoop);
      spawnObstacle();
    });
  </script>
</body>
</html>