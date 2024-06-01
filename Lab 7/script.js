let balls = [];
let numBalls = 100;
let attractionForce = 1; // Siła przyciągania/odpychania
const Y = 0.2;
let isAttracting = true;
let X = 1;
let Yforce = 1;
const maxRadius = 50; // Maksymalna wielkość kulki

function setup() {
	let canvasContainer = document.getElementById("canvas-container");
	let canvas = createCanvas(
		canvasContainer.offsetWidth,
		windowHeight * 0.8 - 40
	);
	canvas.parent("canvas-container");
	canvas.mousePressed(handleMousePress);
	reset();
}

function start() {
	numBalls = document.getElementById("numBalls").value;
	X = parseFloat(document.getElementById("X").value);
	Yforce = parseFloat(document.getElementById("Y").value);
	reset();
}

function reset() {
	balls = [];
	for (let i = 0; i < numBalls; i++) {
		balls.push(new Ball());
	}
}

function toggleForce() {
	isAttracting = !isAttracting;
}

function draw() {
	background(255);
	for (let i = balls.length - 1; i >= 0; i--) {
		balls[i].move();
		balls[i].display();
		balls[i].applyForce(
			mouseX,
			mouseY,
			isAttracting ? attractionForce : -attractionForce
		);

		for (let j = i + 1; j < balls.length; j++) {
			let d = dist(balls[i].x, balls[i].y, balls[j].x, balls[j].y);
			if (d < width * Y) {
				stroke(0);
				line(balls[i].x, balls[i].y, balls[j].x, balls[j].y);
				balls[i].transferEnergy(balls[j]);
			}
		}

		if (balls[i].radius < 1) {
			balls.splice(i, 1);
		}
	}
}

class Ball {
	constructor(x = random(width), y = random(height), radius = random(5, 20)) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vx = random(-2, 2);
		this.vy = random(-2, 2);
	}

	move() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x > width || this.x < 0) {
			this.vx *= -1;
		}
		if (this.y > height || this.y < 0) {
			this.vy *= -1;
		}

		// Adjust speed based on size
		let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
		let newSpeed = map(this.radius, 1, maxRadius, 4, 0.5);
		this.vx = (this.vx / speed) * newSpeed;
		this.vy = (this.vy / speed) * newSpeed;
	}

	display() {
		noStroke();
		fill(0);
		ellipse(this.x, this.y, this.radius * 2);
		stroke(0);
		noFill();
		ellipse(this.x, this.y, this.radius * 2);
	}

	applyForce(mx, my, force) {
		let d = dist(this.x, this.y, mx, my);
		if (d < 100) {
			let angle = atan2(this.y - my, this.x - mx);
			let fx = cos(angle) * force;
			let fy = sin(angle) * force;
			this.vx += fx;
			this.vy += fy;
		}
	}

	isClicked(mx, my) {
		let d = dist(this.x, this.y, mx, my);
		return d < this.radius;
	}

	transferEnergy(other) {
		let myEnergy = this.calculateEnergy();
		let otherEnergy = other.calculateEnergy();

		if (myEnergy > otherEnergy) {
			let transferAmount = otherEnergy * 0.005; // Zmniejsz ilość transferowanej energii
			this.radius = constrain(this.radius + transferAmount / 2, 0, maxRadius);
			other.radius = max(1, other.radius - transferAmount / 2);
		} else {
			let transferAmount = myEnergy * 0.005; // Zmniejsz ilość transferowanej energii
			this.radius = max(1, this.radius - transferAmount / 2);
			other.radius = constrain(other.radius + transferAmount / 2, 0, maxRadius);
		}
	}

	calculateEnergy() {
		let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
		let mass = this.radius * this.radius * PI;
		return X * speed + Yforce * mass;
	}
}

function handleMousePress() {
	for (let i = balls.length - 1; i >= 0; i--) {
		if (balls[i].isClicked(mouseX, mouseY)) {
			balls.splice(i, 1);
			balls.push(new Ball());
			balls.push(new Ball());
		}
	}
}

function windowResized() {
	let canvasContainer = document.getElementById("canvas-container");
	resizeCanvas(canvasContainer.offsetWidth, windowHeight * 0.8 - 40);
	reset();
}
