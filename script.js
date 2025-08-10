
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

let stars = [];
for (let i=0;i<200;i++) stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.5+0.2, s: Math.random()*0.2+0.05 });

let meteors = [];
let objects = []; // active flying objects
let objectImages = []; // loaded images from objects.json

let spawnTimers = { meteors: null, objects: null };
let lastObjectSpawn = 0;
const OBJECT_MIN_DISTANCE = 80; // min distance between spawn points
const OBJECT_SIZE = 64;

// load object list
fetch('objects.json').then(r=>r.json()).then(list=>{
  list.forEach(p=>{ const img=new Image(); img.src=p; objectImages.push(img); });
}).catch(e=>{ console.warn('Failed to load objects.json', e); });

function drawStars(){
  ctx.fillStyle='white';
  for (let s of stars) ctx.fillRect(s.x, s.y, s.r, s.r);
}
function updateStars(){
  for (let s of stars){ s.y += s.s; if (s.y>canvas.height){ s.y=0; s.x=Math.random()*canvas.width; } }
}

// meteor simple
function spawnMeteor(){ meteors.push({ x: Math.random()*canvas.width, y:-50, len: Math.random()*80+50, speed: Math.random()*3+2 }); }
function updateMeteors(){ meteors.forEach(m=>{ m.x+=m.speed; m.y+=m.speed; }); meteors = meteors.filter(m=>m.y<canvas.height+100); }
function drawMeteors(){ ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2; meteors.forEach(m=>{ ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-m.len*Math.cos(Math.PI/4), m.y-m.len*Math.sin(Math.PI/4)); ctx.stroke(); }); }

// collision check for spawn position
function tooCloseToOthers(x,y){
  for (let o of objects){
    const dx = o.x - x, dy = o.y - y;
    if (Math.hypot(dx,dy) < OBJECT_MIN_DISTANCE) return true;
  }
  return false;
}

// spawn from random side without height limit and avoid collisions on spawn
function spawnObject(){
  if (objectImages.length===0) return;
  // pick image
  const img = objectImages[Math.floor(Math.random()*objectImages.length)];
  // pick side and starting coords
  const side = Math.floor(Math.random()*4); // 0 left,1 right,2 top,3 bottom
  let x,y,vx,vy;
  const speed = 1.5 + Math.random()*2.5;
  if (side===0){ x=-OBJECT_SIZE; y=Math.random()*canvas.height; vx=speed; vy=(Math.random()-0.5)*1.2; }
  else if (side===1){ x=canvas.width+OBJECT_SIZE; y=Math.random()*canvas.height; vx=-speed; vy=(Math.random()-0.5)*1.2; }
  else if (side===2){ x=Math.random()*canvas.width; y=-OBJECT_SIZE; vx=(Math.random()-0.5)*1.2; vy=speed; }
  else { x=Math.random()*canvas.width; y=canvas.height+OBJECT_SIZE; vx=(Math.random()-0.5)*1.2; vy=-speed; }

  // avoid spawning too close to existing objects -- try up to N times
  let tries=0;
  while(tooCloseToOthers(x,y) && tries<6){
    // nudge position
    if (side===0 || side===1) y = Math.random()*canvas.height; else x = Math.random()*canvas.width;
    tries++;
  }
  if (tooCloseToOthers(x,y)) return; // give up this spawn

  objects.push({ img, x, y, vx, vy, size: OBJECT_SIZE });
}

// update and draw objects
function updateObjects(){
  for (let o of objects){ o.x += o.vx; o.y += o.vy; }
  objects = objects.filter(o=> o.x>-150 && o.x<canvas.width+150 && o.y>-150 && o.y<canvas.height+150 );
}
function drawObjects(){
  for (let o of objects){
    try { ctx.drawImage(o.img, o.x, o.y, o.size, o.size); } catch(e){};
  }
}

// animation loop
let rafId=0;
function animate(t){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawStars(); drawMeteors(); drawObjects();
  updateStars(); updateMeteors(); updateObjects();
  rafId = requestAnimationFrame(animate);
}
animate();

// spawn timers - controlled with visibility API to avoid burst
function startSpawns(){
  if (spawnTimers.meteors) clearInterval(spawnTimers.meteors);
  if (spawnTimers.objects) clearInterval(spawnTimers.objects);
  spawnTimers.meteors = setInterval(spawnMeteor, 3000);
  spawnTimers.objects = setInterval(spawnObject, 3500);
  lastObjectSpawn = performance.now();
}
function stopSpawns(){
  if (spawnTimers.meteors) { clearInterval(spawnTimers.meteors); spawnTimers.meteors=null; }
  if (spawnTimers.objects) { clearInterval(spawnTimers.objects); spawnTimers.objects=null; }
}

// handle visibilitychange: stop spawns when hidden, restart when visible (no backlog)
document.addEventListener('visibilitychange', ()=>{
  if (document.hidden){
    stopSpawns();
  } else {
    // reset last spawn time so we don't spawn bunch immediately
    lastObjectSpawn = performance.now();
    // small delay before restart to avoid immediate cluster
    setTimeout(()=> startSpawns(), 500);
  }
});

startSpawns();

// Intro handling: fade intro and show UI
setTimeout(()=>{
  const intro = document.getElementById('intro');
  if (intro){
    intro.classList.add('fade-out');
    setTimeout(()=>{ intro.remove(); const ui=document.getElementById('ui'); if (ui) ui.classList.add('show');
    document.querySelector('.logo').classList.add('show'); }, 900);
  }
}, 2400);


// Плавное появление блоков после вступления
function showContentAfterIntro() {
    document.querySelectorAll('.about-text, .menu-item').forEach(el => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 300);
    });
}

// Вызываем после вступления
setTimeout(showContentAfterIntro, 4000);

// Дополнительные фоновые события: вспышки
setInterval(() => {
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.width = '2px';
    flash.style.height = '2px';
    flash.style.background = 'white';
    flash.style.borderRadius = '50%';
    flash.style.top = Math.random() * window.innerHeight + 'px';
    flash.style.left = Math.random() * window.innerWidth + 'px';
    flash.style.opacity = '1';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1000);
}, 5000);

// Частицы вокруг "kosmos"
setInterval(() => {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '3px';
    particle.style.height = '3px';
    particle.style.background = '#9d4edd';
    particle.style.borderRadius = '50%';
    const kosmos = document.querySelector('.kosmos-text');
    if (kosmos) {
        const rect = kosmos.getBoundingClientRect();
        particle.style.top = (rect.top + window.scrollY + Math.random() * rect.height) + 'px';
        particle.style.left = (rect.left + window.scrollX + Math.random() * rect.width) + 'px';
    }
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
}, 800);
