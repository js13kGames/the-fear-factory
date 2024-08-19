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
   mg.context.fillText("JUMP: " + cart.hero.jumpHeight, nativeWidth-200, 80);
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

function getTile(xHero, yHero) {
    let c = Math.round((yHero / 64) + (xHero / 128));
    let r = Math.round((yHero / 64) - (xHero / 128));

    if(cart.tiles[c + (10 * r)]!=null){
      cart.tiles[c + (10 * r)].sx=49;
    }

    return cart.tiles[c + (10 * r)];
}

function drawIsometricRoom() {
    const tileWidth = 128;
    const tileHeight = 64;
    const roomWidth = 10; // Number of tiles
    const roomDepth = 10; // Number of tiles
    const roomHeight = 4; // Number of tiles

    // Draw floor with checkered pattern
    for (let y = 0; y < roomDepth; y++) {
        for (let x = 0; x < roomWidth; x++) {
            const color = (x + y) % 2 === 0 ? '#273746' : '#566573';
            drawTile(
                startX + (x - y) * (tileWidth / 2),
                startY + (x + y) * (tileHeight / 2),
                tileWidth, tileHeight,
                color // Alternating black and white
            );
        }
    }
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
