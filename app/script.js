const slider = document.getElementById("time-slider");
const eraLabel = document.getElementById("era-label");
const body = document.body;
const eras = ["Past", "Present", "Future"];

slider.addEventListener("input", () => {
  const idx = parseInt(slider.value);
  const era = eras[idx];
  eraLabel.textContent = era;
  eras.forEach(e => body.classList.remove(e.toLowerCase()));
  body.classList.add(era.toLowerCase());
  updateCards(era.toLowerCase());
});

function updateCards(era) {
  const cards = [
    document.getElementById("card-1"),
    document.getElementById("card-2"),
    document.getElementById("card-3")
  ];

  if (era === "past") {
    cards[0].querySelector("p").textContent = "You spent time learning old skills.";
    cards[1].querySelector("p").textContent = "Stats show vintage trends.";
    cards[2].querySelector("p").textContent = "Predicted nostalgia events.";
  } else if (era === "present") {
    cards[0].querySelector("p").textContent = "Current tasks ongoing.";
    cards[1].querySelector("p").textContent = "Stats are real-time.";
    cards[2].querySelector("p").textContent = "Predictions for today.";
  } else if (era === "future") {
    cards[0].querySelector("p").textContent = "Prepare for upcoming challenges.";
    cards[1].querySelector("p").textContent = "Future trends visualized.";
    cards[2].querySelector("p").textContent = "Predicted success metrics.";
  }
}

// Particle Animation
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = eras[slider.value] === "Future" ? "#ff00ff" : "#00ffff";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x > canvas.width) this.x = 0;
    if(this.x < 0) this.x = canvas.width;
    if(this.y > canvas.height) this.y = 0;
    if(this.y < 0) this.y = canvas.height;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for(let i=0;i<100;i++){
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();
