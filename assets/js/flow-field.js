const canvas = document.getElementById('flowCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let flowField = [];
let cols, rows;
const resolution = 20;
let time = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cols = Math.floor(width / resolution);
    rows = Math.floor(height / resolution);
    
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            life: Math.random() * 200 + 100
        });
    }
}

function updateFlowField() {
    flowField = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const angle = Math.sin(x * 0.005 + time * 0.0005) * 
                        Math.cos(y * 0.005 + time * 0.0003) * Math.PI * 2;
            flowField.push(angle);
        }
    }
}

function updateParticles() {
    particles.forEach(particle => {
        const col = Math.floor(particle.x / resolution);
        const row = Math.floor(particle.y / resolution);
        const index = col + row * cols;
        
        if (flowField[index] !== undefined) {
            const angle = flowField[index];
            particle.vx += Math.cos(angle) * 0.05;
            particle.vy += Math.sin(angle) * 0.05;
        }
        
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        particle.life--;
        
        if (particle.life <= 0 || particle.x < 0 || particle.x > width || 
            particle.y < 0 || particle.y > height) {
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
            particle.vx = 0;
            particle.vy = 0;
            particle.life = Math.random() * 200 + 100;
        }
    });
}

function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.02)';
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(particle => {
        const alpha = particle.life / 300;
        ctx.fillStyle = `rgba(100, 150, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function animate() {
    time++;
    updateFlowField();
    updateParticles();
    draw();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', function() {
    resize();
    animate();
});
