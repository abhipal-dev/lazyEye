<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Bricks Breaker - LazyEye Therapy</title>
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
      padding: 10px;
    }

    /* Top HUD Bar */
    .breaker-hud {
      width: 100%;
      max-width: 800px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 8px 16px;
      margin-bottom: 10px;
      backdrop-filter: blur(8px);
    }

    .brand-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-title h1 {
      font-size: 16px;
      font-weight: 800;
      background: linear-gradient(135deg, #f43f5e, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .eye-legend {
      display: flex;
      gap: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .eye-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .score-badge {
      font-size: 15px;
      font-weight: 800;
      color: #38bdf8;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 8px;
    }

    /* Canvas Arena */
    .arena-box {
      position: relative;
      border-radius: 12px;
      padding: 3px;
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.4), rgba(56, 189, 248, 0.4));
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
      cursor: ew-resize;
    }

    canvas#myCanvas {
      display: block;
      background: #000000;
      border-radius: 9px;
    }

    @media (max-width: 768px) {
      .brand-title h1 {
        font-size: 13px;
      }
      .breaker-hud {
        padding: 6px 12px;
      }
    }
  </style>
</head>
<body>

  <div class="breaker-hud">
    <div class="brand-title">
      <i class="fa-solid fa-shapes" style="color: #f43f5e;"></i>
      <h1>BRICKS BREAKER</h1>
      <div class="eye-legend">
        <div class="eye-item">
          <span class="dot" id="dotLeft" style="background: #ef4444;"></span>
          <span>Paddle & Ball</span>
        </div>
        <div class="eye-item">
          <span class="dot" id="dotRight" style="background: #06b6d4;"></span>
          <span>Target Bricks</span>
        </div>
      </div>
    </div>

    <div class="score-badge">
      Score: <span id="scoreVal">0</span>
    </div>
  </div>

  <div class="arena-box">
    <canvas id="myCanvas"></canvas>
  </div>

  <script>
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Responsive sizing
    function setupDimensions() {
      const maxW = Math.min(window.innerWidth - 30, 800);
      const maxH = Math.min(window.innerHeight - 100, 560);
      canvas.width = Math.max(320, maxW);
      canvas.height = Math.max(360, maxH);
    }
    setupDimensions();

    let leftColor = '#ef4444';
    let rightColor = '#06b6d4';

    function updateColors(left, right) {
      if (left) leftColor = left;
      if (right) rightColor = right;
      document.getElementById('dotLeft').style.background = leftColor;
      document.getElementById('dotRight').style.background = rightColor;
    }

    let ballRadius = 9;
    let x = canvas.width / 2;
    let y = canvas.height - 40;
    let dx = 3.5;
    let dy = -3.5;

    let paddleHeight = 12;
    let paddleWidth = 110;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    // Responsive brick grid
    const brickRowCount = Math.min(10, Math.floor((canvas.width - 40) / 70));
    const brickColumnCount = 5;
    const brickPadding = 10;
    const brickOffsetTop = 20;
    const totalBrickWidth = canvas.width - 40;
    const brickWidth = Math.floor((totalBrickWidth - (brickRowCount - 1) * brickPadding) / brickRowCount);
    const brickHeight = 22;
    const brickOffsetLeft = Math.floor((canvas.width - (brickRowCount * brickWidth + (brickRowCount - 1) * brickPadding)) / 2);

    let score = 0;
    let bricks = [];

    function initBricks() {
      bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
    }
    initBricks();

    // Mouse & Touch tracking for paddle
    document.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
      }
    }, { passive: true });

    // Keyboard handlers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
    });

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              score++;
              document.getElementById('scoreVal').innerText = score;
              if (score === brickRowCount * brickColumnCount) {
                initBricks();
              }
            }
          }
        }
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = leftColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = leftColor;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.roundRect(paddleX, canvas.height - paddleHeight - 6, paddleWidth, paddleHeight, 6);
      ctx.fillStyle = leftColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = leftColor;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
            ctx.fillStyle = rightColor;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      // Wall bouncing
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius - paddleHeight - 6) {
        // Paddle collision
        if (x > paddleX && x < paddleX + paddleWidth) {
          // Angle ball based on where it hit paddle
          const hitPos = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
          dx = hitPos * 5;
          dy = -Math.abs(dy);
        } else if (y + dy > canvas.height - ballRadius) {
          // Ball fell below paddle: reset ball position smoothly
          x = canvas.width / 2;
          y = canvas.height - 60;
          dx = (Math.random() > 0.5 ? 3 : -3);
          dy = -3.5;
        }
      }

      // Keyboard movement
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;

      requestAnimationFrame(loop);
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
        const message = { msg: 'Game Ended', game: 'Bricks Breaker', score: score };
        window.parent.postMessage(message, "*");
        console.log('Game ended by Game js timer');
      }, sessionDuration);
    });

    $(document).ready(function() {
      $(window).focus();
      updateColors(leftColor, rightColor);
      requestAnimationFrame(loop);
    });
  </script>
</body>
</html>