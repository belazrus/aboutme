const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let meteors = [];
let rockets = [];

// Звезды
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.2 + 0.05
  });
}

function drawStars() {
  ctx.fillStyle = 'white';
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateStars() {
  for (let s of stars) {
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  }
}

// Метеор
function spawnMeteor() {
  meteors.push({
    x: Math.random() * canvas.width,
    y: -50,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 4 + 2,
    angle: Math.PI / 4
  });
}

function drawMeteors() {
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  for (let m of meteors) {
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.length * Math.cos(m.angle), m.y - m.length * Math.sin(m.angle));
    ctx.stroke();
  }
}

function updateMeteors() {
  for (let m of meteors) {
    m.x += m.speed;
    m.y += m.speed;
  }
  meteors = meteors.filter(m => m.y < canvas.height + 100);
}

// Ракета
function spawnRocket() {
  rockets.push({
    x: -50,
    y: Math.random() * canvas.height * 0.5,
    speed: 5
  });
}

function drawRockets() {
  ctx.fillStyle = 'red';
  for (let r of rockets) {
    ctx.beginPath();
    ctx.rect(r.x, r.y, 40, 10);
    ctx.fill();
  }
}

function updateRockets() {
  for (let r of rockets) {
    r.x += r.speed;
  }
  rockets = rockets.filter(r => r.x < canvas.width + 100);
}

// Анимация
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  drawMeteors();
  drawRockets();
  updateStars();
  updateMeteors();
  updateRockets();
  requestAnimationFrame(animate);
}

// События
setInterval(spawnMeteor, 3000);
setInterval(spawnRocket, 8000);

animate();

// Вступление
setTimeout(() => {
  document.getElementById('intro').classList.add('fade-out');
  setTimeout(() => {
    document.getElementById('intro').remove();
  }, 1000);
}, 3000);
