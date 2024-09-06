let portal = { radius: 40, rotation: 0 };

const stars = [];

function addStar() {
  let size = Math.random() * 5 + 2
  stars.push({
    x: 0,
    y: 0,
    size: size,
    angle: angle = Math.random() * 2 * Math.PI,
    speed: (Math.random() * 2 + 1) / size,
    life: 100,
    alpha: 1
  });
}

function updateStars() {
  stars.forEach((s, index) => {
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.life -= 1;
    s.alpha = s.life / 100;

    if (s.life <= 0) {
      stars.splice(index, 1);
    }
  });
}

function drawPortal(x,y) {
  // Function to draw a rotating arc-based portal
  function draw(x, y, rotation, radius, colors) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, (i * Math.PI / 5), ((i + 1) * Math.PI / 5), false);
      ctx.lineWidth = 20;
      ctx.strokeStyle = i % 2 === 0 ? colors[0] : colors[1];
      ctx.stroke();
    }
    drawStars();
    ctx.restore();

    updateStars();
    addStar();
  }

  // Draw the outer and inner portals with separate rotations
  let c1 = cart.getLvl().tileCol1;
  let c2 = cart.getLvl().tileCol2;

  draw(x, y, portal.rotation, portal.radius+2, ["#fff","#fff"]);
  draw(x, y, portal.rotation, portal.radius, [c1,c2]);
  draw(x, y, -portal.rotation, portal.radius / 2 - 2, [c2, c1]);

  // Update rotations
  portal.rotation += 0.03;
}

function drawStars() {
  stars.forEach(s => {
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
}
