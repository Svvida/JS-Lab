let ball = document.getElementById("ball");
let hole = document.getElementById("hole");
let gameArea = document.getElementById("game-area");
let scoreBoard = document.getElementById("score");
let timeDisplay = document.getElementById("time");
let score = 0;
let startTime;
let interval;
let gameDuration = 60;

function initGame() {
	positionBallAndHole();
	startTime = Date.now();
	interval = setInterval(updateTime, 1000);
	window.addEventListener("deviceorientation", handleOrientation);
}

function positionBallAndHole() {
	ball.style.top = Math.random() * (gameArea.clientHeight - 30) + "px";
	ball.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
	hole.style.top = Math.random() * (gameArea.clientHeight - 30) + "px";
	hole.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
}

function handleOrientation(event) {
	let beta = event.beta; // [-180,180]
	let gamma = event.gamma; // [-90,90]

	// Restrict beta and gamma values to -45 to 45
	beta = Math.max(Math.min(beta, 45), -45);
	gamma = Math.max(Math.min(gamma, 45), -45);

	let top = parseInt(ball.style.top) + (beta / 45) * 5;
	let left = parseInt(ball.style.left) + (gamma / 45) * 5;

	// Ensure ball stays within game area
	if (top < 0) top = 0;
	if (top > gameArea.clientHeight - 30) top = gameArea.clientHeight - 30;
	if (left < 0) left = 0;
	if (left > gameArea.clientWidth - 30) left = gameArea.clientWidth - 30;

	ball.style.top = top + "px";
	ball.style.left = left + "px";

	checkIfInHole();
}

function checkIfInHole() {
	let ballRect = ball.getBoundingClientRect();
	let holeRect = hole.getBoundingClientRect();

	let isColliding = !(
		ballRect.top > holeRect.bottom ||
		ballRect.bottom < holeRect.top ||
		ballRect.left > holeRect.right ||
		ballRect.right < holeRect.left
	);

	if (isColliding) {
		score++;
		scoreBoard.textContent = score;
		positionBallAndHole();
	}
}

function updateTime() {
	let elapsed = Math.floor((Date.now() - startTime) / 1000);
	timeDisplay.textContent = elapsed;
	if (elapsed >= gameDuration) {
		endGame();
	}
}

function endGame() {
	clearInterval(interval);
	window.removeEventListener("deviceorientation", handleOrientation);
	alert(`Game Over! Your score is: ${score}`);
}

window.onload = initGame;
