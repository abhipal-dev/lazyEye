<!DOCTYPE html>
<html lang="en">

<head>
	<style>
		body {
			margin: 0px;
		}
		#myGame{
			background: #000;

		}
		.crcl {
			width: 80px;
			height: 80px;
			border-radius: 100%;
			position: relative;
			background-color: red;
			background-size: cover;
			animation: movement;
			animation-iteration-count:infinite;
		}

		/* To set the positions for the logo
		for the whole animation */
		@keyframes movement {
			0% {
				left: 0px;
				top: 0px
			}

			5% {
				left: 300px;
				top: 0px
			}

			10% {
				left: 600px;
				top: 300px
			}

			15% {
				left: 600px;
				top: 0px
			}

			20% {
				left: 300px;
				top: 300px
			}

			25% {
				left: 300px;
				top: 600px
			}

			30% {
				left: 300px;
				top: 300px
			}

			35% {
				left: 600px;
				top: 300px
			}

			40% {
				left: 300px;
				top: 600px
			}

			45% {
				left: 0px;
				top: 600px
			}

			50% {
				left: 0px;
				top: 300px
			}

			55% {
				left: 300px;
				top: 300px
			}

			60% {
				left: 300px;
				top: 600px
			}

			65% {
				left: 600px;
				top: 300px
			}

			70% {
				left: 300px;
				top: 600px
			}

			75% {
				left: 0px;
				top: 600px
			}

			80% {
				left: 0px;
				top: 300px
			}

			85% {
				left: 300px;
				top: 300px
			}

			90% {
				left: 600px;
				top: 300px
			}

			95% {
				left: 300px;
				top: 300px
			}

			100% {
				left: 0px;
				top: 0px;
			}
		}

		.details {
			float: right;
			width: 400px;
			height: 100vh;
			position: relative;
			background-color: rgb(12, 34, 158);
			color: white;
			display: block;
			text-align: center;
		}

		.ground {
			float: left;
		}

		.level {
			display: flex;
			margin: 10px;
			margin-top: 25px;
		}

		.display_score {
			margin-top: 25px;
		}

		button {
			border-radius: 25px;
			width: 8em;
			height: 3em;
			font-size: 20px;
			border: 2px solid white;
			background: transparent;
			color: white;
			margin: 10px;
			cursor: pointer;
		}

		button:hover {
			background-color: white;
			color: rgb(12, 34, 158);
			box-shadow: 0px 10px 20px 10px white;
			transition-duration: 1s;
		}
	</style>
	<script
	src="https://code.jquery.com/jquery-3.6.3.min.js"
	integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU="
	crossorigin="anonymous"></script>
</head>

<body>
	<sectionf id="myGame">
		<div class="ground">
			<div id="circle" onclick="count()"></div>
		</div>
		<div class="details">
			<h1>Tap to Start</h1>
			<h3>Click on a difficulty to start the game</h3>
			<div class="level">
				<button onclick="easy()">EASY</button>
				<button onclick="medium()">MEDIUM</button>
				<button onclick="hard()">HARD</button>
			</div>
			<div class="display_score">
				<h2>Score</h2>
				<h2 id="score">0</h2>
			</div>
			<!-- <button onclick="restart()">START</button>
			<button onclick="restart()">RESTART</button> -->
		</div>
	</section>

	<script>
		var score=0;
		$( document ).ready(function() {       
		var w = window.innerWidth;
        var h = window.innerHeight; 
        console.log("GAme 2 ->width : "+w+" | "+"Height : "+h);
		$('section#mygame').height(h-20);
        $('section#mygame').width(w-20);
        window.addEventListener('message', function(event) {
                 window.parent.postMessage('Game Started', "*");
                 console.log(event.data.msg); 
				 setTimeout(function() {
            message={msg:'Game Ended',game:"Ball Catcher",score:score}
            window.parent.postMessage(message, "*");
            console.log('Game ended by Game js')
        }, event.data.time);   
         });
		
		});
		function easy() {
			console.log("easy mode")
			document.getElementById('circle')
				.style.animationDuration = '40s';
			document.getElementById('circle')
				.className = 'crcl';
				clearInterval()
				setInterval(function(){
			console.log('Hii')
			$('div#circle').css("pointer-events","auto");
		}, 2000);
		}

		// Setting the level to Medium by having the
		// duration of the whole animation to the maximum
		function medium() {
			document.getElementById('circle')
				.style.animationDuration = '32s';
			document.getElementById('circle')
				.className = 'crcl';
				clearInterval()
				setInterval(function(){
			console.log('Hii')
			$('div#circle').css("pointer-events","auto");
		}, 1600);
		}

		// Setting the level to Hard by having the
		// duration of the whole animation to the maximum
		function hard() {
			document.getElementById('circle')
				.style.animationDuration = '24s';
			document.getElementById('circle')
				.className = 'crcl';
				clearInterval()
				setInterval(function(){
			console.log('Hii')
			$('div#circle').css("pointer-events","auto");
		}, 1200);
		}

		let cnt = 0;

		// Function to count the number of taps
		// and display the score
		function count() {
			cnt = parseInt(1) + parseInt(cnt);
			var scr = document.getElementById('score');
			scr.innerHTML = cnt;
			score++;
			console.log('Score : '+score)
			$('div#circle').css("pointer-events","none");
		}

		// Restart the game by refreshing the page
		function restart() {
			window.location.reload();
		}
	</script>
</body>
	
</html>
