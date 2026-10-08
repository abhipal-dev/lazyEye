<!DOCTYPE html>
<html>
<head>
<title>Basic Bust-a-Move / Puzzle Bobble / Bubble Shooter HTML Game</title>
<meta charset="UTF-8">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

<style>
html, body {
height: 100%;
margin: 0;
}

body {
background: black;
display: flex;
align-items: center;
justify-content: center;
}
</style>
</head>
<body>
<div style="position:fixed; top:12px; left:50%; transform:translateX(-50%); z-index:100; display:flex; align-items:center; gap:16px; background:rgba(15,23,42,0.88); border:1px solid rgba(255,255,255,0.2); border-radius:30px; padding:6px 20px; color:#f8fafc; font-family:sans-serif; font-size:13px; backdrop-filter:blur(8px); box-shadow:0 4px 16px rgba(0,0,0,0.5);">
  <span style="font-weight:700; letter-spacing:0.5px; color:#38bdf8;">BUBBLE SHOOTER</span>
  <span style="color:#64748b;">|</span>
  <span>Score: <b id="hudScore" style="color:#facc15;">0</b></span>
  <button id="finishBubbleBtn" style="background:#059669; border:none; color:#fff; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:600; cursor:pointer;">Finish & Save</button>
</div>
<canvas width="471" height="992" id="game"></canvas>
<script>
var h = window.innerHeight;
var w = window.innerWidth;
var leftColor ='',rightColor=''; 
h = h-(h%32)
w = w-(w%64)
console.log("width:"+ w, "Height : "+h)   
var fixed_col =20,fixed_row=h/32,score=0;

$("canvas").attr("height",h);

function reportSession() {
  var message = { msg: 'Game Ended', game: "Bubble Shooter", score: score };
  window.parent.postMessage(message, "*");
  console.log('Bubble shooter session reported with score:', score);
}

window.reportGameSession = reportSession;
window.currentSession = {
  game: 'Bubble Shooter',
  getScore: function() { return score; }
};

$(document).ready(function(){
  $(window).focus();
  document.getElementById('finishBubbleBtn')?.addEventListener('click', reportSession);
}) 

var leftColor = '#ef4444', rightColor = '#06b6d4';

window.addEventListener('message', function(event) {
  if (!event.data) return;
  if (event.data.leftColor) leftColor = event.data.leftColor;
  if (event.data.rightColor) rightColor = event.data.rightColor;
  if (typeof colorMap !== 'undefined') {
    colorMap['R'] = leftColor;
    colorMap['L'] = rightColor;
  }
  window.parent.postMessage("Game Started", "*");
  var sessionDuration = (event.data.time && !isNaN(event.data.time) && event.data.time > 10000) ? event.data.time : (20 * 60 * 1000);
  setTimeout(function() {
    reportSession();
    console.log('Game ended by Game js timer');
  }, sessionDuration);
});


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// puzzle bubble is played on a hex grid. instead of doing complicated
// math of working with a hex grid, we can just fill the screen with
// bubbles in their correct positions. each bubble will start inactive,
// meaning we pretend the bubble isn't there (don't draw it or count
// it for collision). when the bubble we shoot collides with a wall
// or another active bubble, we just find the closest inactive bubble
// and make it active with the same color as the shot bubble. this
// gives the illusion of the bubble snapping to a grid
const grid = 32;

// each even row is 8 bubbles long and each odd row is 7 bubbles long.
// the level consists of 4 rows of bubbles of 4 colors: red, orange,
// green, and yellow
const level1 = [
['R','R','Y','Y','L','L','C','C','R','R','L','L','Y','Y'],
['R','R','Y','Y','L','L','C','C','L','Y','Y','L','L'],
['L','L','C','C','R','R','Y','Y','R','L','Y','Y','R','R'],
['L','C','C','L','R','C','C','L','C','C','R','L','Y'],
['L','Y','R','R','L','Y','Y','L','C','C','Y','R','Y'],
['R','R','Y','Y','C','C','R','R','Y','R','C','L','R'],
['C','C','L','Y','L','L','C','C','R','R','L','L','Y','Y'],
['R','R','Y','Y','L','L','C','C','L','Y','Y','L','L'],
['L','L','C','C','R','R','Y','Y','R','L','Y','Y','R','R'],
['L','C','C','L','R','C','C','L','C','C','R','L','Y'],
['L','Y','R','R','L','Y','Y','L','C','C','Y','R','Y'],
['R','R','Y','Y','C','C','R','R','Y','R','C','L','R']
];

// create a mapping between color short code (R, G, B, Y) and color name
const colorMap = {
'R': leftColor,
'L': rightColor,
'C': 'cyan',
'Y': 'yellow'
};
const colors = Object.values(colorMap);

// use a 1px gap between each bubble
const bubbleGap = 1;

// the size of the outer walls for the game
const wallSize = 4;
var bubbles = [];
let particles = [];

// helper function to convert deg to radians
function degToRad(deg) {
return (deg * Math.PI) / 180;
}

// rotate a point by an angle
function rotatePoint(x, y, angle) {
let sin = Math.sin(angle);
let cos = Math.cos(angle);

return {
x: x * cos - y * sin,
y: x * sin + y * cos
};
}

// get a random integer between the range of [min,max]
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);

return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get the distance between two points
function getDistance(obj1, obj2) {
const distX = obj1.x - obj2.x;
const distY = obj1.y - obj2.y;
return Math.sqrt(distX * distX + distY * distY);
}

// check for collision between two circles
function collides(obj1, obj2) {
return getDistance(obj1, obj2) < obj1.radius + obj2.radius;
}

// find the closest bubbles that collide with the object
function getClosestBubble(obj, activeState = false) {
const closestBubbles = bubbles
.filter(bubble => bubble.active == activeState && collides(obj, bubble));

if (!closestBubbles.length) {
return;
}

return closestBubbles
// turn the array of bubbles into an array of distances
.map(bubble => {
return {
distance: getDistance(obj, bubble),
bubble
}
})
.sort((a, b) => a.distance - b.distance)[0].bubble;
}

// create the bubble grid bubble. passing a color will create
// an active bubble
function createBubble(x, y, color) {
const row = Math.floor(y / grid);
const col = Math.floor(x / grid);

// bubbles on odd rows need to start half-way on the grid
const startX = row % 2 === 0 ? 0 : 0.5 * grid;

// because we are drawing circles we need the x/y position
// to be the center of the circle instead of the top-left
// corner like you would for a square
const center = grid / 2;

bubbles.push({
x: wallSize + (grid + bubbleGap) * col + startX + center,

// the bubbles are closer on the y axis so we subtract 4 on every
// row
y: wallSize + (grid + bubbleGap - 4) * row + center,

radius: grid / 2,
color: color,
active: color ? true : false
});
}

// get all bubbles that touch the passed in bubble
function getNeighbors(bubble) {
const neighbors = [];

// check each of the 6 directions by "moving" the bubble by a full
// grid in each of the 6 directions (60 degree intervals)
// @see https://www.redblobgames.com/grids/hexagons/#angles
const dirs = [
// right
rotatePoint(grid, 0, 0),
// up-right
rotatePoint(grid, 0, degToRad(60)),
// up-left
rotatePoint(grid, 0, degToRad(120)),
// left
rotatePoint(grid, 0, degToRad(180)),
// down-left
rotatePoint(grid, 0, degToRad(240)),
// down-right
rotatePoint(grid, 0, degToRad(300))
];

for (let i = 0; i < dirs.length; i++) {
const dir = dirs[i];

const newBubble = {
x: bubble.x + dir.x,
y: bubble.y + dir.y,
radius: bubble.radius
};
const neighbor = getClosestBubble(newBubble, true);
if (neighbor && neighbor !== bubble && !neighbors.includes(neighbor)) {
neighbors.push(neighbor);
}
}

return neighbors;
}

// remove bubbles that create a match of 3 colors
function removeMatch(targetBubble) {
const matches = [targetBubble];

bubbles.forEach(bubble => bubble.processed = false);
targetBubble.processed = true;

// loop over the neighbors of matching colors for more matches
let neighbors = getNeighbors(targetBubble);
for (let i = 0; i < neighbors.length; i++) {
let neighbor = neighbors[i];

if (!neighbor.processed) {
neighbor.processed = true;
if (neighbor.color === targetBubble.color) {
// console.log("*************************")
// console.log(neighbor.color)
// console.log(targetBubble.color)
matches.push(neighbor);
neighbors = neighbors.concat(getNeighbors(neighbor));
}
}
}

if (matches.length >= 3) {
matches.forEach(bubble => {
bubble.active = false;
score+=1;
});
const el = document.getElementById('hudScore');
if (el) el.innerText = score;
}
}

// make any floating bubbles (bubbles that don't have a bubble chain
// that touch the ceiling) drop down the screen
function dropFloatingBubbles() {
const activeBubbles = bubbles.filter(bubble => bubble.active);
activeBubbles.forEach(bubble => bubble.processed = false);

// start at the bubbles that touch the ceiling
let neighbors = activeBubbles
.filter(bubble => bubble.y - grid <= wallSize);

// process all bubbles that form a chain with the ceiling bubbles
for (let i = 0; i < neighbors.length; i++) {
let neighbor = neighbors[i];

if (!neighbor.processed) {
neighbor.processed = true;
neighbors = neighbors.concat(getNeighbors(neighbor));
}
}

// any bubble that is not processed doesn't touch the ceiling
activeBubbles
.filter(bubble => !bubble.processed)
.forEach(bubble => {
bubble.active = false;
// create a particle bubble that falls down the screen
particles.push({
x: bubble.x,
y: bubble.y,
color: bubble.color,
radius: bubble.radius,
active: true
});
});
}

// fill the grid with inactive bubbles
console.log(fixed_row)
console.log(fixed_col)
for (let row = 0; row < fixed_row; row++) {
for (let col = 0; col <  (row % 2 === 0 ? fixed_col : fixed_col-1); col++) {
// if the level has a bubble at the location, create an active
// bubble rather than an inactive one
const color = level1[row]?.[col];
createBubble(col * grid, row * grid, colorMap[color]);
}
}

const curBubblePos = {
// place the current bubble horizontally in the middle of the screen
x: canvas.width / 2,
y: canvas.height - grid * 1.5
};
const curBubble = {
x: curBubblePos.x,
y: curBubblePos.y,
color: leftColor,
radius: grid / 2,  // a circles radius is half the width (diameter)

// how fast the bubble should go in either the x or y direction
speed: 8,

// bubble velocity
dx: 0,
dy: 0
};

// angle (in radians) of the shooting arrow
let shootDeg = 0;

// min/max angle (in radians) of the shooting arrow
const minDeg = degToRad(-60);
const maxDeg = degToRad(60);

// the direction of movement for the arrow (-1 = left, 1 = right)
let shootDir = 0;

// reset the bubble to shoot to the bottom of the screen
function getNewBubble() {
curBubble.x = curBubblePos.x;
curBubble.y = curBubblePos.y;
curBubble.dx = curBubble.dy = 0;

const randInt = getRandomInt(0, colors.length - 1);
curBubble.color = colors[randInt];
}

// handle collision between the current bubble and another bubble
function handleCollision(bubble) {
bubble.color = curBubble.color;
bubble.active = true;
getNewBubble();
removeMatch(bubble);
dropFloatingBubbles();
}

function drawScore() {
// score=1;
context.fillStyle = '#fff';
context.font = '35px sans-serif';

// syntax --> fillText(text, x, y)
context.fillText(score,10,fixed_row*grid-10);
}
// game loop
function loop() {
requestAnimationFrame(loop);
context.clearRect(0,0,canvas.width,canvas.height);

// move the shooting arrow
shootDeg = shootDeg + degToRad(2) * shootDir;

// prevent shooting arrow from going below/above min/max
if (shootDeg < minDeg) {
shootDeg = minDeg;
}
else if (shootDeg > maxDeg) {
shootDeg = maxDeg
}

// move current bubble by it's velocity
curBubble.x += curBubble.dx;
curBubble.y += curBubble.dy;

// prevent bubble from going through walls by changing its velocity
if (curBubble.x - grid / 2 < wallSize) {
curBubble.x = wallSize + grid / 2;
curBubble.dx *= -1;
}
else if (curBubble.x + grid / 2 > canvas.width - wallSize) {
curBubble.x = canvas.width - wallSize - grid / 2;
curBubble.dx *= -1;
}

// check to see if bubble collides with the top wall
if (curBubble.y - grid / 2 < wallSize) {
// make the closest inactive bubble active
const closestBubble = getClosestBubble(curBubble);
handleCollision(closestBubble);
}

// check to see if bubble collides with another bubble
for (let i = 0; i < bubbles.length; i++) {
const bubble = bubbles[i];

if (bubble.active && collides(curBubble, bubble)) {
const closestBubble = getClosestBubble(curBubble);
if (!closestBubble)  {
  // window.alert('Game Over ! Run Again');
        // window.location.reload();
        console.log(bubbles)
        bubbles = []
        particles = []
         neighbors=[]
         activeBubbles=[]
// fill the grid with inactive bubbles
for (let row = 0; row < fixed_row; row++) {
  for (let col = 0; col < (row % 2 === 0 ? fixed_row : fixed_row-1); col++) {
    // if the level has a bubble at the location, create an active
    // bubble rather than an inactive one
    const color = level1[row]?.[col];
    createBubble(col * grid, row * grid, colorMap[color]);
  }
}
}

if (closestBubble) {
handleCollision(closestBubble);
}
}
}
drawScore();
// move bubble particles
particles.forEach(particle => {
particle.y += 20;
});


// remove particles that went off the screen
particles = particles.filter(particles => particles.y < canvas.height - grid / 2);

// draw walls
context.fillStyle = 'lightgrey';
context.fillRect(0, 0, canvas.width, wallSize);
context.fillRect(0, 0, wallSize, canvas.height);
context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

// draw bubbles and particles
bubbles.concat(particles).forEach(bubble => {
if (!bubble.active) return;
context.fillStyle = bubble.color;

// draw a circle
context.beginPath();
context.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
context.fill();
});

// draw fire arrow. since we're rotating the canvas we need to save
// the state and restore it when we're done
context.save();

// move to the center of the rotation (the middle of the bubble)
context.translate(curBubblePos.x, curBubblePos.y);
context.rotate(shootDeg);

// move to the top-left corner of or fire arrow
context.translate(0, -grid / 2 * 4.5);

// draw arrow ↑
context.strokeStyle = 'white';
context.lineWidth = 2;
context.beginPath();
context.moveTo(0, 0);
context.lineTo(0, grid * 2);
context.moveTo(0, 0);
context.lineTo(-10, grid * 0.4);
context.moveTo(0, 0);
context.lineTo(10, grid * 0.4);
context.stroke();

context.restore();

// draw current bubble
context.fillStyle = curBubble.color;
context.beginPath();
context.arc(curBubble.x, curBubble.y, curBubble.radius, 0, 2 * Math.PI);
context.fill();
}

// listen for keyboard events to move the fire arrow
document.addEventListener('keydown', (e) => {
if (e.code === 'ArrowLeft') {
shootDir = -1;
}
else if (e.code === 'ArrowRight') {
shootDir = 1;
}

// if the current bubble is not moving we can launch it
if (e.code === 'Space' &&  curBubble.dx === 0 && curBubble.dy === 0) {
// convert an angle to x/y
curBubble.dx = Math.sin(shootDeg) * curBubble.speed;
curBubble.dy = -Math.cos(shootDeg) * curBubble.speed;
}
});

// listen for keyboard events to stop moving the fire arrow if key is
// released
document.addEventListener('keyup', (e) => {
if (
// only reset shoot dir if the released key is also the current
// direction of movement. otherwise if you press down both arrow
// keys at the same time and then release one of them, the arrow
// stops moving even though you are still pressing a key
(e.code === 'ArrowLeft' && shootDir === -1) ||
(e.code === 'ArrowRight' && shootDir === 1)
) {
shootDir = 0;
}
});

// Aim and shoot on click / touch
canvas.addEventListener('pointerdown', (e) => {
  if (curBubble && curBubble.dx === 0 && curBubble.dy === 0) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const angle = Math.atan2(clickX - curBubble.x, -(clickY - curBubble.y));
    shootDeg = Math.max(degToRad(-75), Math.min(degToRad(75), angle));
    curBubble.dx = Math.sin(shootDeg) * curBubble.speed;
    curBubble.dy = -Math.cos(shootDeg) * curBubble.speed;
  }
});

// start the game
requestAnimationFrame(loop);
</script>
</body>
</html>