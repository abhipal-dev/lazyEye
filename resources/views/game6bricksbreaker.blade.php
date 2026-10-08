<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <style>
        canvas { background: black;
        cursor:none; }
         * {cursor:none}
    </style>
</head>
<body style="cursor:auto;">
    <section id="myGame">
        <canvas id="myCanvas" width="1575" height="1140" id="game"></canvas>

    </section>
    <script>
     var leftColor ='',rightColor=''; 
         $( document ).ready(function() {  
            document.querySelector('body').style.cursor = 'none';
            // document.documentElement.style.cursor = 'none';
            // document.body.requestPointerLock();
            $(window).focus();      
                var w = window.innerWidth;
                var h = window.innerHeight;
                // var elem = document.getElementById("myCanvas"); 
                // elem.width=w;
                // elem.height=h;
                console.log(w)
                console.log(h)
                $('canvas').height(h-20);
                $('canvas').width(w-10);
                window.addEventListener('message', function(event) {
                         window.parent.postMessage('Game Started', "*");
                         console.log(event.data.msg);    
                         console.log(event.data.leftColor);    
                         console.log(event.data.rightColor);  
                         leftColor = event.data.leftColor
                         rightColor = event.data.rightColor  
                         var sessionDuration = (event.data.time && !isNaN(event.data.time) && event.data.time > 10000) ? event.data.time : (20 * 60 * 1000);
                         setTimeout(function() {
                    message={msg:'Game Ended',score:score}
                    window.parent.postMessage(message, "*");
                    console.log('Game ended by Game js')
                }, sessionDuration);
                 });
               
        });

        
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var ballRadius = 15;
        var x = canvas.width/2;
        var y = canvas.height-30;
        var dx = 2;
        var dy = -2;
        var paddleHeight = 10;
        var paddleWidth = 150;
        var paddleX = (canvas.width-paddleWidth)/2;
        var rightPressed = false;
        var leftPressed = false;
        var brickRowCount = 16 ;
        var brickColumnCount = 5;
        var brickWidth = 75;
        var brickHeight = 40;
        var brickPadding = 20;
        var brickOffsetTop = 10;
        var brickOffsetLeft = 40;
        var score = 0;

        var bricks = [];
        for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
        }

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        function keyDownHandler(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }
        function collisionDetection() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
                console.log('Score '+score)
                if(score == brickRowCount*brickColumnCount) {
                    alert("YOU WIN, CONGRATS!");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                }
                }
            }
            }
        }
        }

        function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = leftColor;
        ctx.fill();
        ctx.closePath();
        }
        function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = leftColor;
        ctx.fill();
        ctx.closePath();
        }
        function drawBricks() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = rightColor;
                ctx.fill();
                ctx.closePath();
            }
            }
        }
        }
        function drawScore() {
        ctx.font = "3rem Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: "+score, 8, 950);
        }

        function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            }
            else {
            // alert("GAME OVER");
            // document.location.reload();
            // clearInterval(interval); // Needed for Chrome to end game
            // draw()
          x = canvas.width/2;
           y = canvas.height-30;
           dx = 2;
           dy = -2;
           paddleHeight = 10;
           paddleWidth = 150;
           paddleX = (canvas.width-paddleWidth)/2;
           rightPressed = false;
           leftPressed = false;
           brickRowCount = 16;
           brickColumnCount = 5;
           brickWidth = 75;
           brickHeight = 40;
           brickPadding = 20;
           brickOffsetTop = 10;
           brickOffsetLeft = 40;
            }
        } 

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
        }

        var interval = setInterval(draw, 5);
    </script>
</body>
</html>