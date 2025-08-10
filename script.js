const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let meteors = [];
let objects = [];
let objectImages = [];

// Загружаем список объектов из JSON
fetch('objects.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(path => {
      let img = new Image();
      img.src = path;
      objectImages.push(img);
    });
  });

// Звёзды
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

// Летающие объекты
function spawnObject() {
  if (objectImages.length === 0) return;
  const img = objectImages[Math.floor(Math.random() * objectImages.length)];
  objects.push({
    img: img,
    x: -70,
    y: Math.random() * canvas.height * 0.7,
    speed: 3
  });
}

function drawObjects() {
  for (let o of objects) {
    ctx.drawImage(o.img, o.x, o.y, 64, 64);
  }
}

function updateObjects() {
  for (let o of objects) {
    o.x += o.speed;
  }
  objects = objects.filter(o => o.x < canvas.width + 100);
}

// Анимация
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  drawMeteors();
  drawObjects();
  updateStars();
  updateMeteors();
  updateObjects();
  requestAnimationFrame(animate);
}

// События
setInterval(spawnMeteor, 3000);
setInterval(spawnObject, 8000);

animate();

// Вступление
setTimeout(() => {
  document.getElementById('intro').classList.add('fade-out');
  setTimeout(() => {
    document.getElementById('intro').remove();
    document.getElementById('ui').classList.add('show');
  }, 1000);
}, 3000);
