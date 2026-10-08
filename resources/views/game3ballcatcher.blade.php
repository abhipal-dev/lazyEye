<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Ball Catcher - Hand-Eye Coordination</title>
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 12px;
    }

    .game-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 20px;
      width: 100%;
      max-width: 950px;
      height: calc(100vh - 24px);
      max-height: 700px;
    }

    /* Play Field Area */
    .play-area {
      position: relative;
      flex: 1;
      height: 100%;
      background: #000000;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      overflow: hidden;
      cursor: crosshair;
    }

    .target-orb {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: #ef4444;
      border: 3px solid #06b6d4;
      box-shadow: 0 0 20px currentColor;
      cursor: pointer;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .target-orb:active {
      transform: translate(-50%, -50%) scale(0.9);
    }

    .target-orb::after {
      content: '';
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ffffff;
      opacity: 0.8;
    }

    /* Side Control Panel */
    .control-panel {
      width: 280px;
      height: 100%;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(8px);
    }

    .panel-header h1 {
      font-size: 20px;
      font-weight: 800;
      background: linear-gradient(135deg, #f43f5e, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }

    .panel-header p {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Vision Legend */
    .vision-legend {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 10px;
      font-size: 11px;
      margin-top: 14px;
    }

    .legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    /* Score Box */
    .score-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin: 12px 0;
    }

    .score-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .score-number {
      font-size: 36px;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 4px;
      font-variant-numeric: tabular-nums;
    }

    /* Difficulty Buttons */
    .difficulty-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn-diff {
      background: rgba(30, 41, 59, 0.8);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .btn-diff:hover, .btn-diff.active {
      background: linear-gradient(135deg, #e11d48, #0284c7);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
    }

    @media (max-width: 768px) {
      .game-wrapper {
        flex-direction: column;
        height: auto;
        max-height: none;
      }
      .play-area {
        width: 100%;
        height: 380px;
      }
      .control-panel {
        width: 100%;
        height: auto;
      }
    }
  </style>
</head>
<body>

  <div class="game-wrapper">
    <!-- Play Field -->
    <div class="play-area" id="playArea">
      <div class="target-orb" id="orb"></div>
    </div>

    <!-- Controls & HUD -->
    <div class="control-panel">
      <div class="panel-header">
        <h1>BALL CATCHER</h1>
        <p>Fixation & Saccadic Tracking</p>

        <div class="vision-legend">
          <div class="legend-row">
            <span class="dot" id="dotLeft" style="background: #ef4444;"></span>
            <span>Target Orb (Left Eye)</span>
          </div>
          <div class="legend-row">
            <span class="dot" id="dotRight" style="background: #06b6d4;"></span>
            <span>Focus Border (Right Eye)</span>
          </div>
        </div>
      </div>

      <div class="score-card">
        <div class="score-label">BALLS CAUGHT</div>
        <div class="score-number" id="score">0</div>
      </div>

      <div>
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Speed Difficulty</div>
        <div class="difficulty-group">
          <button class="btn-diff active" id="btnEasy" onclick="setDifficulty('easy')">EASY (Slow Motion)</button>
          <button class="btn-diff" id="btnMedium" onclick="setDifficulty('medium')">MEDIUM (Dynamic)</button>
          <button class="btn-diff" id="btnHard" onclick="setDifficulty('hard')">HARD (Rapid Saccades)</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let score = 0;
    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';
    let speed = 2.0; // movement velocity
    let targetX = 150;
    let targetY = 150;
    let currentX = 150;
    let currentY = 150;
    let vx = 2;
    let vy = 2;
    let animId = null;

    const orb = document.getElementById('orb');
    const playArea = document.getElementById('playArea');
    const scoreDisplay = document.getElementById('score');

    function updateColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;

      orb.style.backgroundColor = leftColor;
      orb.style.borderColor = rightColor;
      document.getElementById('dotLeft').style.background = leftColor;
      document.getElementById('dotRight').style.background = rightColor;
    }

    function moveOrb() {
      const areaW = playArea.clientWidth;
      const areaH = playArea.clientHeight;
      const radius = 32;

      currentX += vx * speed;
      currentY += vy * speed;

      // Bounce against arena walls
      if (currentX <= radius) {
        currentX = radius;
        vx = Math.abs(vx);
      } else if (currentX >= areaW - radius) {
        currentX = areaW - radius;
        vx = -Math.abs(vx);
      }

      if (currentY <= radius) {
        currentY = radius;
        vy = Math.abs(vy);
      } else if (currentY >= areaH - radius) {
        currentY = areaH - radius;
        vy = -Math.abs(vy);
      }

      orb.style.left = currentX + 'px';
      orb.style.top = currentY + 'px';

      animId = requestAnimationFrame(moveOrb);
    }

    // Catch handler
    function catchOrb(e) {
      e.stopPropagation();
      score++;
      scoreDisplay.innerText = score;

      // Pulse feedback
      orb.style.transform = 'translate(-50%, -50%) scale(1.3)';
      setTimeout(() => {
        orb.style.transform = 'translate(-50%, -50%) scale(1.0)';
      }, 150);

      // Pick new random trajectory
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * (Math.random() * 2 + 1.5);
      vy = Math.sin(angle) * (Math.random() * 2 + 1.5);
    }

    orb.addEventListener('pointerdown', catchOrb);

    function setDifficulty(level) {
      document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
      if (level === 'easy') {
        speed = 1.2;
        document.getElementById('btnEasy').classList.add('active');
      } else if (level === 'medium') {
        speed = 2.4;
        document.getElementById('btnMedium').classList.add('active');
      } else if (level === 'hard') {
        speed = 3.8;
        document.getElementById('btnHard').classList.add('active');
      }
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
        const message = { msg: 'Game Ended', game: "Ball Catcher", score: score };
        window.parent.postMessage(message, "*");
        console.log('Game ended by Game js timer');
      }, sessionDuration);
    });

    $(document).ready(function() {
      $(window).focus();
      updateColors(leftColor, rightColor);
      currentX = playArea.clientWidth / 2 || 150;
      currentY = playArea.clientHeight / 2 || 150;
      moveOrb();
    });
  </script>
</body>
</html>
