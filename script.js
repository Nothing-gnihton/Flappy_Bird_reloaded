const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 480;

// Image sources
const birdSprites = [
  "https://img.icons8.com/ios-filled/100/000000/bird.png",
  "https://img.icons8.com/ios/100/000000/bird.png"
];
const bambooImage = new Image();
bambooImage.src = "https://img.icons8.com/emoji/96/bamboo.png";

const bgImage = new Image();
bgImage.src = "https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/000000/external-sky-nature-flatart-icons-flat-flatarticons.png";

let birdImage = new Image();
birdImage.src = birdSprites[0];

let bird = { x: 50, y: 150, width: 30, height: 30, gravity: 0, jump: -4, level: 1 };
let pipes = [];
let score = 0;
let highScores = [0, 0, 0];
let gameOver = false;
let bgX = 0;
let spriteIndex = 0;

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  resetGame();
  gameLoop();
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  startGame();
}

function resetGame() {
  bird.y = 150;
  bird.gravity = 0;
  bird.level = 1;
  bird.width = 30;
  bird.height = 30;
  pipes = [];
  score = 0;
  gameOver = false;
  bgX = 0;
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(bambooImage, pipe.x, 0, pipe.width, pipe.top);
    ctx.drawImage(bambooImage, pipe.x, pipe.top + pipe.gap, pipe.width, canvas.height);
  });
}

function drawBackground() {
  ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
  bgX -= 1;
  if (bgX <= -canvas.width) bgX = 0;
}

function update() {
  if (gameOver) return;

  bird.gravity += 0.2;
  bird.y += bird.gravity;

  if (bird.y > canvas.height || bird.y < 0) {
    return endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipe.gap)
    ) {
      return endGame();
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;

      // Level up every 2 points
      if (score % 2 === 0) {
        bird.level++;
        bird.width += 2;
        bird.height += 2;
      }
    }
  });

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 120) {
    const top = Math.random() * (canvas.height / 2);
    pipes.push({ x: canvas.width, width: 40, top: top, gap: 100, passed: false });
  }
}

function endGame() {
  gameOver = true;
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 3);

  document.getElementById("final-score").innerText = score;
  document.getElementById("high-scores").innerText = highScores.join(", ");

  // Change bird sprite
  spriteIndex = (spriteIndex + 1) % birdSprites.length;
  birdImage.src = birdSprites[spriteIndex];

  document.getElementById("game-over-screen").style.display = "flex";
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  update();
  drawBird();
  drawPipes();
  drawScore();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bird.gravity = bird.jump;
  }
});
canvas.addEventListener("click", () => {
  bird.gravity = bird.jump;
});
