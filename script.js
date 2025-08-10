const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];
let objectImages = [];
let lastSpawn = 0;
let spawnInterval = 2000;

fetch('objects.json')
    .then(r => r.json())
    .then(data => {
        let loaded = 0;
        data.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loaded++;
                if (loaded === data.length) {
                    objectImages = data.map(s => {
                        let i = new Image();
                        i.src = s;
                        return i;
                    });
                    requestAnimationFrame(update);
                }
            };
        });
    });

function spawnObject() {
    if (objectImages.length === 0) return;
    const img = objectImages[Math.floor(Math.random() * objectImages.length)];
    const size = 64;
    let x, y, dx, dy;

    let side = Math.floor(Math.random() * 4);
    if (side === 0) { // left
        x = -size; y = Math.random() * canvas.height;
        dx = Math.random() * 2 + 1; dy = (Math.random() - 0.5) * 2;
    } else if (side === 1) { // right
        x = canvas.width + size; y = Math.random() * canvas.height;
        dx = -(Math.random() * 2 + 1); dy = (Math.random() - 0.5) * 2;
    } else if (side === 2) { // top
        x = Math.random() * canvas.width; y = -size;
        dx = (Math.random() - 0.5) * 2; dy = Math.random() * 2 + 1;
    } else { // bottom
        x = Math.random() * canvas.width; y = canvas.height + size;
        dx = (Math.random() - 0.5) * 2; dy = -(Math.random() * 2 + 1);
    }

    // avoid overlapping
    for (let o of objects) {
        if (Math.hypot(o.x - x, o.y - y) < size * 1.5) return;
    }

    objects.push({ x, y, dx, dy, size, img });
}

function update(timestamp) {
    if (document.hidden) {
        requestAnimationFrame(update);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timestamp - lastSpawn > spawnInterval) {
        spawnObject();
        lastSpawn = timestamp;
    }

    objects.forEach(o => {
        o.x += o.dx;
        o.y += o.dy;
        ctx.drawImage(o.img, o.x, o.y, o.size, o.size);
    });

    objects = objects.filter(o => o.x > -100 && o.x < canvas.width + 100 && o.y > -100 && o.y < canvas.height + 100);

    requestAnimationFrame(update);
}

// Intro fade and show main content
setTimeout(() => {
    document.getElementById('intro').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('intro').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    }, 2000);
}, 2000);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
