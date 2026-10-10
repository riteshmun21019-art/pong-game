const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');

const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - 55,
  width: 14,
  height: 110,
  speed: 8,
  color: '#f8fafc'
};

const rightPaddle = {
  x: canvas.width - 34,
  y: canvas.height / 2 - 55,
  width: 14,
  height: 110,
  color: '#f8fafc',
  speed: 5.8
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  vx: 5,
  vy: 4,
  color: '#fbbf24'
};

let playerScore = 0;
let computerScore = 0;

const keys = {
  ArrowUp: false,
  ArrowDown: false
};

let mouseY = canvas.height / 2;

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    keys[event.key] = true;
    event.preventDefault();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    keys[event.key] = false;
  }
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  mouseY = (event.clientY - rect.top) * scaleY;
});

function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  const baseSpeed = 5.5;
  const multiplier = direction === 'left' ? 1 : -1;
  ball.vx = multiplier * baseSpeed;
  ball.vy = (Math.random() * 2 - 1) * 4.5;
}

function updatePaddles() {
  // Mouse control for left paddle
  leftPaddle.y = mouseY - leftPaddle.height / 2;

  // Keyboard arrows for left paddle
  if (keys.ArrowUp) leftPaddle.y -= leftPaddle.speed;
  if (keys.ArrowDown) leftPaddle.y += leftPaddle.speed;

  leftPaddle.y = Math.max(0, Math.min(canvas.height - leftPaddle.height, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));

  // Computer AI movement
  const targetY = ball.y - rightPaddle.height / 2;
  rightPaddle.y += (targetY - rightPaddle.y) * 0.12;
  rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
}

function handleCollisions() {
  // Top and bottom wall collisions
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }

  if (ball.y + ball.radius >= canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= -1;
  }

  // Left paddle collision
  if (
    ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height &&
    ball.vx < 0
  ) {
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    ball.vx = Math.abs(ball.vx) + 0.15;
    const relativeIntersectY = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
    ball.vy = relativeIntersectY * 6.5;
  }

  // Right paddle collision
  if (
    ball.x + ball.radius >= rightPaddle.x &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height &&
    ball.vx > 0
  ) {
    ball.x = rightPaddle.x - ball.radius;
    ball.vx = -Math.abs(ball.vx) - 0.15;
    const relativeIntersectY = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
    ball.vy = relativeIntersectY * 6.5;
  }

  // Score and reset
  if (ball.x - ball.radius < 0) {
    computerScore += 1;
    computerScoreEl.textContent = computerScore;
    resetBall('right');
  } else if (ball.x + ball.radius > canvas.width) {
    playerScore += 1;
    playerScoreEl.textContent = playerScore;
    resetBall('left');
  }
}

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  updatePaddles();
  handleCollisions();
}

function drawCenterLine() {
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 14]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddles() {
  ctx.fillStyle = leftPaddle.color;
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  ctx.fillStyle = rightPaddle.color;
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#020817';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCenterLine();
  drawPaddles();
  drawBall();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

resetBall('left');
requestAnimationFrame(gameLoop);

