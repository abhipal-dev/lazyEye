<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<link href="css/adminStyle.css" rel="stylesheet" />


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
<!-- <link rel="stylesheet" href="../css/app.css "></link> -->
    <title>Lazy Eye</title>
    <style>
                  / ------------------ Ping Pong game--------------------- /
.game_content {
  height: 100%;
  background-color: black;

  / width: 100vw; /
  / background-image: linear-gradient(to top, #ffda77, #ffa45b); /
  display: flex;
  justify-content: center;
  align-items: center;
}

.board {
  background-color: black;

  height: 100%;
  width: 100%;
  / background-image: linear-gradient(to right, #5c6e91, #839b97); /
  / border-radius: 14px; /
}

.ball {
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  position: fixed;
  top: calc(50% - 1.5rem);
  left: calc(50% - 1.5rem);
}

.ball_effect {
  height: 100%;
  width: 100%;
  border-radius: 10rem;
  / animation: spinBall 0.8s linear infinite; /
      box-shadow: 5rem 10rem 20rem 5rem red inset
}

@keyframes spinBall {
  100% {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  }
}

.paddle {
  height: 6rem;
  width: .5rem;
  / border-radius: 50; /
  position: fixed;
}

.paddle_1 {
  top: calc(2.5vh + 3.5rem);
  left: calc(0.2vw + 1.0rem);
  box-shadow: 0 0 5rem blue inset;
  
}

.paddle_2 {
  top: calc(85vh);
  right: calc(0.2vw + 1rem);
  box-shadow: 0 0 5rem blue inset;
}

.player_1_score {
  height: 5;
  width: 5;
  color: red;
  position: fixed;
  left: 30vw;
  margin-top: 3rem;
}

.player_2_score {
  height: 5rem;
  width: 5rem;
  color: red;
  position: fixed;
  left: 70vw;
  margin-top: 3rem;
}

.message {
  position: fixed;
  / color: #48426d; /
  height: 10vh;
  width: 30vw;
  color: blue;
  left: 38vw;
  margin: 3rem auto auto auto;
}





body{
  margin-top:2rem;
  color: #1a202c;
  text-align: left;
  background-color: #e2e8f0;    
}
.main-body {
  padding: 15px;
}
.card {
  box-shadow: 0 0.2rem 0.6rem 0 rgba(0,0,0,.1), 0 0.5rem 0.6rem 0 rgba(0,0,0,.06);
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 0 solid rgba(0,0,0,.125);
  border-radius: .25rem;
}

.card-body {
  flex: 1 1 auto;
  min-height: 1rem;
  padding: 1rem;
}

.gutters-sm {
  margin-right: -0.8rem;
  margin-left: -0.8rem;
}

.gutters-sm>.col, .gutters-sm>[class*=col-] {
  padding-right: 0.8rem;
  padding-left: 0.8rem;
}
.mb-3, .my-3 {
  margin-bottom: 1rem!important;
}

.bg-gray-300 {
  background-color: #e2e8f0;
}
.h-100 {
  height: 100%!important;
}
.shadow-none {
  box-shadow: none!important;
}

.card {
 /* width: 17rem; */
 height: 12rem;
 background-color: #FCF7FF;
 border: none;
 position: relative;
 margin:1rem;
 font-family: inherit;
 border-radius: 1rem;
 box-shadow:  .5rem .5rem 1.0rem #c3c3c3,
             -.5rem -.5rem 1.0rem #fdfdfd;}

.card-row{
    margin-top: 2rem;
}
.card span {
 font-weight: 600;
 color: black;
 text-align: center;
 display: block;
 padding: 1rem;
 font-size: 1.3rem;
}



div.card  button {
 background-color: #eee;
 display: block;
 font-weight: 600;
 margin: auto;

 border: none;
 padding: 0.6rem;
 font-size: 1rem;
 width: 8rem;
 border-radius: 1rem;
 color: black;
 box-shadow: 0 0.4rem #dfd9d9;
 cursor: pointer;
}


div.card  button:active {
 color: white;
 box-shadow: 0 0.2rem #dfd9d9;
 transform: translateY(0.2rem);
}


div.card  button:hover:not(:disabled) {
 background: lightcoral;
 color: white;
 text-shadow: 0 0.1rem #bcb4b4;
}

div.card  button:disabled {
 cursor: auto;
 color: grey;
}


/* / ---------------Dashboard---------------- / */
            </style>
</head>
<body >
<!-- <iframe id="frame" src="http://localhost/testChild"  width="1200" height="500" allow="fullscreen" title="Snake Game Testing"></iframe> -->
<section id="user"></section>    
<script>

  window.addEventListener('message', function(event) {
    console.log("Message received from the child: " + event.data); // Message received from child
  });
</script>
<script src="{{asset('js/app.js')}}"></script>
<script src="{{asset('js/frontendScript.js')}}"></script>
</body>
</html>