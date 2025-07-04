const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const g = 9.81; 
 
let animationId = null;
let trajectory = [];
let currentTime = 0;
let projectile = null;
 
class Projectile {
  constructor(velocity, angle, height) {
    this.v0 = velocity;
    this.angle = angle * Math.PI / 180; 
    this.h0 = height;
    this.x = 0;
    this.y = height;
    this.vx = velocity * Math.cos(this.angle);
    this.vy = velocity * Math.sin(this.angle);
    this.time = 0;
    this.maxHeight = height;
    this.range = 0;
  }

  update(dt) {
    this.time += dt;
    this.x = this.vx * this.time;
    this.y = this.h0 + this.vy * this.time - 0.5 * g * this.time * this.time;
    this.maxHeight = Math.max(this.maxHeight, this.y);
    this.range = this.x;
  }

  getFinalVelocity() {
    const vx = this.vx;
    const vy = this.vy - g * this.time;
    return Math.sqrt(vx * vx + vy * vy);
  }
}
 
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function drawGrid() {
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

const margin = 50;
let scaleX = 1;
let scaleY = 1;
let maxX = 100;
let maxY = 50;
let plotWidth = 0;
let plotHeight = 0;

function drawAxes() {
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;

  // X-axis (horizontal Line) 
  ctx.beginPath();
  ctx.moveTo(50, margin + plotHeight);  
  ctx.lineTo(canvas.width , margin + plotHeight);
  ctx.stroke();

  // Y-axis (vertical Line)
  ctx.beginPath();
  ctx.moveTo(margin, 0);
  ctx.lineTo(margin, canvas.height - 50);
  ctx.stroke();
}

function drawLabels() {
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  const xStep = Math.max(1, Math.floor(maxX / 10));
  const yStep = Math.max(1, Math.floor(maxY / 8));

  // X-axis labels
  for (let x = 0; x <= maxX; x += xStep) {
    const screenX = margin + x * scaleX;
    ctx.fillText(x.toFixed(0), screenX, margin + plotHeight + 20);
  }

  // Y-axis labels
  ctx.textAlign = 'right';
  for (let y = 0; y <= maxY; y += yStep) {
    const screenY = margin + plotHeight - y * scaleY;
    ctx.fillText(y.toFixed(0), margin - 10, screenY + 4);
  }

  // Axis titles
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#374151';

  ctx.fillText('Horizontal Range (m)', canvas.width / 2, canvas.height - 10);

  ctx.save();
  ctx.translate(15, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Vertical Height (m)', 0, 0);
  ctx.restore();
}

function drawTrajectory() {
  ctx.strokeStyle = 'rgba(100, 108, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  trajectory.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.screenX, point.screenY);
    else ctx.lineTo(point.screenX, point.screenY);
  });
  ctx.stroke();
}
 
function drawProjectile(x, y) {
  ctx.fillStyle = '#646cff';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
}
 
function updateResults() {
  if (!projectile) return;
  
  document.getElementById('time').textContent = projectile.time.toFixed(2) + ' s';
  document.getElementById('max-height').textContent = projectile.maxHeight.toFixed(2) + ' m';
  document.getElementById('range').textContent = projectile.range.toFixed(2) + ' m';
  document.getElementById('final-velocity').textContent = projectile.getFinalVelocity().toFixed(2) + ' m/s';
}
 
function animate() {
  if (!projectile) return;

  const dt = 0.016;
  projectile.update(dt);

  const screenX = margin + projectile.x * scaleX;
  const screenY = margin + plotHeight - projectile.y * scaleY;

  trajectory.push({ screenX, screenY });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawAxes();
  drawLabels();
  drawTrajectory();
  drawProjectile(screenX, screenY);
  updateResults();

  if (projectile.y <= 0) {
    cancelAnimationFrame(animationId);
    return;
  }

  animationId = requestAnimationFrame(animate);
}

function launch() {
  const velocity = parseFloat(document.getElementById('velocity').value);
  const angle = parseFloat(document.getElementById('angle').value);
  const height = parseFloat(document.getElementById('height').value);

  trajectory = [];
  projectile = new Projectile(velocity, angle, height);

  const vy = velocity * Math.sin(angle * Math.PI / 180);
  const totalTime = (vy + Math.sqrt(vy * vy + 2 * g * height)) / g;
  const range = velocity * Math.cos(angle * Math.PI / 180) * totalTime;
  const maxHeight = height + (vy * vy) / (2 * g);

  maxX = range + 10;
  maxY = maxHeight + 10;

  plotWidth = canvas.width - 2 * margin;
  plotHeight = canvas.height - 2 * margin;

  scaleX = plotWidth / maxX;
  scaleY = plotHeight / maxY;

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  animate();
}

function reset() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  trajectory = [];
  projectile = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  document.getElementById('velocity').value = '20';
  document.getElementById('angle').value = '45';
  document.getElementById('height').value = '0';

  document.getElementById('time').textContent = '0.00 s';
  document.getElementById('max-height').textContent = '0.00 m';
  document.getElementById('range').textContent = '0.00 m';
  document.getElementById('final-velocity').textContent = '0.00 m/s';
}

// Event listeners
window.addEventListener('resize', resizeCanvas);
document.getElementById('launch').addEventListener('click', launch);
document.getElementById('reset').addEventListener('click', reset);

// Initial setup
resizeCanvas();
drawGrid();
