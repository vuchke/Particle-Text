// DECLARE GLOBAL VARIABLES
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let adjustX = 10;
let adjustY = 10;

let particleArray = [];

// CREATE OBJECT TO STORE MOUSE COORDS
let mouse = {
  x: null,
  y: null,
  radius: 250,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;

  // console.log(mouse.x, mouse.y);
});

ctx.fillStyle = "White";
ctx.font = "25px Verdana";
// fillText('content', x, y)
// fillText can have 4th optional value for max width
ctx.fillText("Ivana", 0, 30);

// draw a rectangle to visualise where we get image data from
// ctx.strokeStyle = 'White'
// ctx.strokeRect(0, 0, 200, 100)
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

// CREATE PARTICLE BLUEPRINT
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    // baseX = particle original position
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }
  draw() {
    ctx.fillStyle = "Green";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    // we need a force value to be between 0 and 1
    // (100 - 20) / 100, 80/100 = 0.8
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      // if particle is not on its base coord { return it back }
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 20;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 20;
      }
    }
  }
}

// USE PARTICLE BLUEPRINT TO FILL PARTICLE ARRAY WITH PARTICLE OBJECTS
function init() {
  particleArray = [];
  // randomly create 1130 particles
  // for (let i = 0; i < 1130; i++) {
  //   let x = Math.random() * canvas.width;
  //   let y = Math.random() * canvas.height;
  //   particleArray.push(new Particle(x, y));
  // }

  // we scan canvas area row by row to find out where are text pixels
  let alpha = 0;
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    // when we finish 1 row with this for loop
    // we go back to the Y loop, y++, and scan a new row
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      alpha = alpha + 4;
      if (
        textCoordinates.data[alpha] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 10, positionY * 10));
      }
    }
  }
}
init();

// console.log(particleArray);

// CREATE ANIMATE LOOP TO REDRAW CANVAS ON EVERY FRAME
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();

// CONNECT THE DOTS OF THEY ARE CLOSE
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      //we sue the same pitagoras princaple as before to calculate hypotenuse
      // let dx = mouse.x - this.x;
      // let dy = mouse.y - this.y;
      // let distance = Math.sqrt(dx * dx + dy * dy);
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        opacityValue = 1 - distance / 50;
        ctx.strokeStyle = "rgba(0,255,0," + opacityValue + ")";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}
