// Useful Functions and classes
function rectanlge(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function rndNo(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function vec2(x,y){
  this.x = x;
  this.y = y;

  this.set = function(x,y) {
    this.x = x;
    this.y = y;
  }
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function getResponsiveFontSize(percent) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  // You might want to adjust the scaling factor (0.1) to get the best size for your design.
  return Math.round(vw * percent); // This sets the font size to 10% of the viewport width.
}

function drawBox(ctx,a,colour,x,y,w,h) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function writeTxt(ctx,a,font,colour,txt,x,y) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = colour;

  ctx.fillText(txt, x, y);
  ctx.restore();
}

function writeCentre(ctx, text, font, x, y) {
  ctx.font = font;
  let textWidth = ctx.measureText(text).width;
  let centeredX = x - (textWidth / 2);
  writeStroke(ctx, 1, font, "BLACK", text, centeredX, y, 12);
  writeTxt(ctx, 1, font, "WHITE", text, centeredX, y);
}

function writeStroke(ctx,a,font,colour,txt,x,y, strokeW) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.strokeStyle = colour; // Color of the stroke
  ctx.lineWidth = strokeW; // Width of the stroke
  ctx.strokeText(txt, x, y);
  ctx.restore();
}

 function displayFPS(fps) {
   mg.context.fillStyle = "yellow";
   mg.context.font = "16px Arial";
   mg.context.fillText("FPS: " + fps.toFixed(2), nativeWidth-100, 20);
   mg.context.fillText("HERO: x:" + cart.hero.e.x + " y:" + cart.hero.e.y, nativeWidth-200, 40);
   mg.context.fillText("HERO: R:" + cart.hero.e.row + " C:" + cart.hero.e.col, nativeWidth-200, 60);
   mg.context.fillText("JUMP: " + Math.ceil(cart.hero.jumpHeight), nativeWidth-200, 80);
   mg.context.fillText("Z: " + Math.ceil(cart.hero.e.z) + " LVL: " + cart.hero.lvl, nativeWidth-200, 100);
   mg.context.fillText("Jumping: " + cart.hero.isJumping, nativeWidth-200, 120);
   mg.context.fillText("Jump H: " + cart.hero.jumpHeight, nativeWidth-200, 140);
   mg.context.fillText("Jump Speed: " + cart.hero.jumpSpeed, nativeWidth-200, 160);
   mg.context.fillText("Falling: " + cart.hero.isFalling, nativeWidth-200, 180);
   if(cart.hero.curTile) mg.context.fillText("Tile ID: " + cart.hero.curTile.id, nativeWidth-200, 200);
 }

 function drawHeroBox(borderRadius) {
   ctx.save();
   ctx.scale(3,3)
   // Set shadow properties
   ctx.shadowColor = '#283747';
   ctx.shadowBlur = 10;
   ctx.shadowOffsetX = 5;
   ctx.shadowOffsetY = 5;

  // Box fill color
  ctx.fillStyle = 'white';
  ctx.fill();

  // Box stroke color
  ctx.strokeStyle = '#17202a';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  var y=check?20:40;
  ctx.roundRect(50, y, 150, 90, 40);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function ranColor() {
  let l = '0123456789ABCDEF';
  let c = '#';
  for (var i = 0; i < 6; i++) {
    c += l[Math.floor(Math.random() * 16)];
  }
  return c;
}

function getTile(xHero, yHero, level) {
  let tiles = cart.levels[cart.cLevel].tiles[level];
  let c = Math.round((yHero / 64) + (xHero / 128));
  let r = Math.round((yHero / 64) - (xHero / 128));

  // Draw the path of the hero (Testing!)
  // if(tiles[c + (cart.levels[cart.cLevel].cols * r)]!=null){
  //   tiles[c + (cart.levels[cart.cLevel].cols * r)].sx=49;
  // }

  return tiles[c + (cart.levels[cart.cLevel].cols * r)]; // TODO move to function
}

function drawIsoTile(col1, col2, y, x, time, wave) {
    const tileWidth = 128;
    const tileHeight = 64;

    const color = (x + y) % 2 === 0 ? col1 : col2;
    let xx = startX + (x - y) * (tileWidth / 2)
    let yy = startY + (x + y) * (tileHeight / 2);
    if(wave) yy+= calculateZ(xx, yy, 10, 20, .3, time)/1.5;

    drawTile(
        xx,
        yy,
        tileWidth, tileHeight,
        color // Alternating black and white
    );
}

function drawTile(x, y, width, height, color) {
  ctx.save();
  ctx.translate(cart.cam.x,cart.cam.y);
  ctx.translate(width,height/2)
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y + height / 2);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x - width / 2, y + height / 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawUI(){
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#17202a";
  ctx.roundRect(10, 10, 50, 300, 30);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#5b2c6f";
  ctx.roundRect(15, 200, 40, 100, 30);
  ctx.fill();

  ctx.beginPath();
  ctx.globalAlpha = .3;
  ctx.fillStyle = "white";
  ctx.roundRect(12, 35, 8, 250, 30);
  ctx.fill();

  ctx.beginPath();
  ctx.globalAlpha = .1;
  ctx.fillStyle = "white";
  ctx.roundRect(24, 35, 4, 250, 30);
  ctx.fill();
  ctx.restore();
}

function drawblock(x, y, width, height, colour, behind) {
  ctx.save();
  if(behind)ctx.globalAlpha=.85;
  ctx.strokeStyle = "#161324";
  ctx.translate(cart.cam.x,cart.cam.y);
  ctx.translate(width,height/2)
  ctx.beginPath();
  ctx.moveTo(x, y);                         // MID
  ctx.lineTo(x + width / 2, y - height/2);  // TOP R
  ctx.lineTo(x + width / 2, y);  // RIGHT SIDE
  ctx.lineTo(x, (y + height/2));          // DOWN TO MID
  ctx.lineTo(x - width / 2, y);  // UP TO LEFT
  ctx.lineTo(x - width / 2, y - height/2);  // LEFT SIDE
  ctx.lineTo(x, y);
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.restore();
  // Drawn the pixel outline
  block.x=x;
  block.y=y-32;
  block.update(0);
}

function hitDust(x, y, arr) {
  // Determine the number of particles to create (excluding the top 2)
  const numParticles = 4; // Adjusted for the remaining 4 positions (left, right, bottom-left, bottom-right)
  const radius = 16; // You can adjust the radius as needed
  const startAngle = Math.PI / 5; // Start slightly above the bottom-left
  const angleIncrement = (Math.PI) / (numParticles + 1); // Adjusted angle increment
  for (let i = 0; i < numParticles; i++) {
      const angle = startAngle + i * angleIncrement;
      const offsetX = Math.cos(angle) * radius + rndNo(-5, 5);
      const offsetY = Math.sin(angle) * radius + rndNo(-5, 5);
      arr.push(new Dusty(x + 55 + offsetX, y + 95 + offsetY));
  }
}

function calculateZ(x, y, amplitude, wavelength, frequency, time) {
    // Calculate wave number and angular frequency
    const k = 2 * Math.PI / wavelength; // Wave number
    const omega = 2 * Math.PI * frequency; // Angular frequency

    // Calculate Z value using the wave formula
    const Z = amplitude * Math.sin(k * (x + y) - omega * time);

    return Z;
}
