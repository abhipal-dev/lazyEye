let character = document.getElementById('character');
let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));

let ground = document.getElementById('ground');

let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('Bottom'));
let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));

let isJumping = false;
let upTime;
let downTime;
let displayScore = document.getElementById('score');
let score = 0;

function jump(){
    console.log(isJumping)
    if(isJumping) return;
    upTime = setInterval(() => {
        if(characterBottom >=groundHeight +200){
            clearInterval(upTime);
            downTime = setInterval(() => {
                if(characterBottom <= groundHeight +10){
                    clearInterval(downTime)
                    isJumping = false;
                }
                characterBottom -= 10;
                character.style.bottom = characterBottom + 'px';
            }, 20)
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + 'px';
        isJumping = true;
    }, 20)
}

function showScore(){
    score++;
    displayScore.textContent = score;
    console.log(displayScore)
    console.log(score)
}

setInterval(showScore, 100);

function generateObstacle(){
    let obstacles = document.querySelector('.obstacles');
    let obstacle = document.createElement('div');
    obstacle.setAttribute('class','obstacle');
    obstacles.appendChild(obstacle);

    let randomTimeout = Math.floor(Math.random() * 1000) + 1000;
    let obstacleRight = -30;
    let obstacleBottom = 100;
    let obstacleWidth = 30;
    let obstacleHeight = Math.floor(Math.random() * 50) + 50;
    obstacle.style.background = 'rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})';
    
    
    function removeObstacles(className){ //function to remove obstacle using class
        const elements = document.getElementsByClassName(className);
        console.log(elements)
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }


    function moveObstacle(){
        obstacleRight += 5;
        obstacle.style.right = obstacleRight + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        if(characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight){
            //console.log('Hit!');
            // console.log("characterRight : "+characterRight)
            // console.log("obstacleRight : "+obstacleRight)
            // console.log("characterWidth : "+characterWidth)
            // console.log("obstacleWidth : "+obstacleWidth)
            // console.log(" characterBottom : "+ characterBottom)
            // console.log(" obstacleBottom : "+ obstacleBottom)
            // console.log("***************************************************")
           
            // alert('Game over! Your score is: '+score);
      clearInterval(obstacleInterval);
       clearTimeout(obstacleTimeout);
    //    removeObstacles('obstacle')//remove obstacles
    // $('div.obstacles').html('')
    location.reload()

    }
}
    let obstacleInterval = setInterval(moveObstacle, 20);
    let obstacleTimeout = setTimeout(generateObstacle, randomTimeout);
    console.log("characterRight : "+characterRight)
    console.log("obstacleRight : "+obstacleRight)
    console.log("characterWidth : "+characterWidth)
    console.log("obstacleWidth : "+obstacleWidth)
    console.log(" characterBottom : "+ characterBottom)
    console.log(" obstacleBottom : "+ obstacleBottom)
    console.log("***************************************************")
}
generateObstacle()

function control(e){
    console.log(e.key)
    if(e.key == "ArrowUp" || e.key == ''){
        jump();
        // obstacleRight = -30+"px";
    }
}

document.addEventListener('keydown', control);