let mouseX = 0; // Mouse X position
let mouseY = 0; // Mouse Y position
interface Sunflower {
  x: number;
  y: number;
}

const sunflowers: Sunflower[] = []; // Store sunflowers
const sunflowerCount = 5; // Number of initial sunflowers
const sunflowerMax = 50; // Max number of sunflowers on screen
const sunflowerSpeed = 1; // Speed of sunflower moving away
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Center of the canvas

function drawSunflower(ctx: CanvasRenderingContext2D, x: number, y: number, petalCount: number, petalLength: number, petalWidth: number, centerRadius: number) {
  const petalColor = '#FFD700'; // Gold color for petals

  // Draw petals
  ctx.fillStyle = petalColor;
  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i * Math.PI * 2) / petalCount); // Rotate for each petal
    ctx.beginPath();
    ctx.ellipse(0, petalLength / 2, petalWidth, petalLength, 0, 0, Math.PI * 2); // Draw petal
    ctx.fill();
    ctx.restore();
  }

  // Draw center
  ctx.fillStyle = '#8B4513'; // Brown color for center
  ctx.beginPath();
  ctx.arc(x, y, centerRadius, 0, Math.PI * 2);
  ctx.fill();
}

export const renderCanvasFlower = function () {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas!.getContext('2d')!;
  
  function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  resizeCanvas();

  // Create initial sunflowers
  for (let i = 0; i < sunflowerCount; i++) {
    sunflowers.push({
      x: Math.random() * ctx.canvas.width, // Random initial position
      y: Math.random() * ctx.canvas.height,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
    sunflowers.forEach(({ x, y }, index) => {
      // Calculate direction away from mouse
      const angle = Math.atan2(mouseY - y, mouseX - x); // Angle from sunflower to mouse

      // Move sunflower away from mouse
      sunflowers[index].x -= Math.cos(angle) * sunflowerSpeed; 
      sunflowers[index].y -= Math.sin(angle) * sunflowerSpeed; 

      // Draw the sunflower
      drawSunflower(ctx, sunflowers[index].x, sunflowers[index].y, 12, 60, 20, 30);
    });

    // Create new sunflowers from the center
    if (sunflowers.length < sunflowerMax) {
      sunflowers.push({
        x: center.x,
        y: center.y,
      });
    }

    requestAnimationFrame(animate); // Call animate again for the next frame
  }

  animate(); // Start animation

  // Update mouse position
  function updateMousePosition(event: { clientX: number; clientY: number; }) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

  // Bind mouse move event
  window.addEventListener('mousemove', updateMousePosition);

  // Redraw on resize
  window.addEventListener('resize', () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
    sunflowers.forEach(({ x, y }) => {
      drawSunflower(ctx, x, y, 12, 60, 20, 30); // Redraw sunflowers
    });
  });
};

// Call renderCanvas on window load
window.onload = renderCanvasFlower;
