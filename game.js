const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 800;
canvas.height = 300;
canvas.style.border = "1px solid #000";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const car = new Image();
car.src = "car_icon.png"; // Replace with actual car icon URL

const obstacles = [
    { src: "parking_gate.png", width: 50, height: 80 },
    { src: "attendant_stand.png", width: 60, height: 90 },
    { src: "traffic_cone.png", width: 40, height: 60 }
];

let carY = canvas.height - 100;
let velocityY = 0;
let gravity = 0.5;
let isJumping = false;
let gameSpeed = 5;
let gameOver = false;
let startTime;

const carWidth = 50;
const carHeight = 50;
const groundY = canvas.height - 50;
let obstaclesArr = [];

function spawnObstacle() {
    const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
    const obstacle = {
        x: canvas.width,
        y: groundY - randomObstacle.height,
        width: randomObstacle.width,
        height: randomObstacle.height,
        img: new Image()
    };
    obstacle.img.src = randomObstacle.src;
    obstaclesArr.push(obstacle);
}

function updateGame() {
    if (gameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw car
    ctx.drawImage(car, 50, carY, carWidth, carHeight);
    
    // Apply gravity
    if (isJumping) {
        carY += velocityY;
        velocityY += gravity;
        if (carY >= groundY - carHeight) {
            carY = groundY - carHeight;
            isJumping = false;
        }
    }
    
    // Move obstacles
    obstaclesArr.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        if (obstacle.x + obstacle.width < 0) {
            obstaclesArr.splice(index, 1);
        }
        
        // Collision detection
        if (
            50 < obstacle.x + obstacle.width &&
            50 + carWidth > obstacle.x &&
            carY < obstacle.y + obstacle.height &&
            carY + carHeight > obstacle.y
        ) {
            endGame();
        }
    });
    
    // Increase speed over time
    gameSpeed += 0.002;
    
    // Spawn obstacles
    if (Math.random() < 0.02) {
        spawnObstacle();
    }
    
    // Check if time is up
    if (Date.now() - startTime >= 60000) {
        winGame();
    }
    
    requestAnimationFrame(updateGame);
}

function jump() {
    if (!isJumping) {
        velocityY = -10;
        isJumping = true;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

function startGame() {
    gameOver = false;
    carY = groundY - carHeight;
    obstaclesArr = [];
    gameSpeed = 5;
    startTime = Date.now();
    updateGame();
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over! Play Again?", canvas.width / 4, canvas.height / 2);
    setTimeout(startGame, 3000);
}

function winGame() {
    gameOver = true;
    ctx.fillStyle = "green";
    ctx.font = "30px Arial";
    ctx.fillText("You Win!", canvas.width / 3, canvas.height / 2);
    setTimeout(startGame, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    startGame();
});
