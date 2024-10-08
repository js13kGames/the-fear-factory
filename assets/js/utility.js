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

function drawBox(ctx,a,colour,x,y,w,h) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

 function displayFPS(fps) {
   mg.context.fillStyle = "yellow";
   mg.context.font = "16px Arial";
   mg.context.fillText("FPS: " + fps.toFixed(2), nativeWidth-120, 20);
   mg.context.fillText("HERO: R:" + cart.hero.e.row + " C:" + cart.hero.e.col, nativeWidth-140, 40);
   mg.context.fillText("Level: " + cart.cLevel, nativeWidth-120, 60);
   if(cart.hero.curTile) mg.context.fillText("TILE ID: " + cart.hero.curTile.id, nativeWidth-120, 80);
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
  var y=check?50:70;

  //roundRect(x, y, width, height, radii)
  ctx.roundRect(50, y, 150, 70, 50);
  ctx.stroke();
  ctx.globalAlpha=.3;
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

function getTile(x, y, level) {
  let tiles = cart.getLvl().tiles[level];
  let c = Math.round((y / 64) + (x / 128));
  let r = Math.round((y / 64) - (x / 128));
  return tiles[c + (cart.getLvl().cols * r)]; // TODO move to function
}

function drawIsoTile(col1, col2, y, x, time, wave, yOff=0) {
    const tileWidth = 128;
    const tileHeight = 64;

    const color = (x + y) % 2 === 0 ? col1 : col2;
    let xx = startX + (x - y) * (tileWidth / 2)
    let yy = startY + (x + y) * (tileHeight / 2);
    if(wave) yy+= calculateZ(xx, yy, 10, 20, .3, time)/1.5;

    drawTile(
        xx,
        yy-yOff,
        tileWidth, tileHeight,
        color // Alternating black and white
    );
}

function drawTile(x, y, width, height, color, alpha=1) {
  ctx.save();
  ctx.globalAlpha=alpha;
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

function textToScreen(text) {
  let perf = performance.now();
  let d=dialogue;
  cart.dialogue.active=true;
  d.active = true;
  d.text = text;
  d.currentText = "";
  d.charIndex = 0;
  d.active=true
  d.nextCharTime = perf + d.textSpeed;
  d.wait=0;
  d.done=false;

  // Set box dimensions based on the canvas size
  d.boxWidth = nativeWidth * 0.9;  // 90% of canvas width
  d.startX = (nativeWidth - d.boxWidth) / 2; // Centered horizontally
  d.startY = nativeHeight*.05; // Near the bottom
}

function drawDialogueBox(dt) {
    if (!dialogue.active) return;
    let perf = performance.now();
    const d = dialogue, ctxProps = (c, f, s) => {
        c.fillStyle = f;
        c.strokeStyle = s;
    };

    // Typewriter effect
    if (perf >= d.nextCharTime && d.charIndex < d.text.length) {
        d.currentText += d.text[d.charIndex++];
        d.nextCharTime = leftMB||space() ? perf + .1 : perf + d.textSpeed;
    }

    // Estimate the number of lines required
    ctx.font = `${d.fontSize} ${d.fontFamily}`;
    let words = d.currentText.split(' ');
    let line = '', lineHeight = 30, lines = 0;
    let boxPadding = 40, maxWidth = d.boxWidth - 2 * boxPadding;

    for (let i = 0; i < words.length; i++) {
        let test = line + words[i] + ' ';
        if (ctx.measureText(test).width > maxWidth) {
            line = words[i] + ' ';
            lines++;
        } else {
            line = test;
        }
    }

    // Adjust the box height based on the number of lines
    d.boxHeight = lines * lineHeight + 2 * boxPadding;

    // Draw the dialogue box
    ctx.save();
    ctxProps(ctx, "rgba(0, 0, 0, 0.8)", "white");
    ctx.fillRect(d.startX, d.startY, d.boxWidth, d.boxHeight);
    ctx.lineWidth = 2;
    ctx.strokeRect(d.startX, d.startY, d.boxWidth, d.boxHeight);

    // Render the wrapped text
    ctx.font = `${d.fontSize} ${d.fontFamily}`;
    ctxProps(ctx, "white");
    wrapText(ctx, d.currentText, d.startX + boxPadding*2.4, d.startY + boxPadding, maxWidth, lineHeight);
    ctx.restore();
    if(d.currentText==d.text)d.wait+=dt;
    if(d.done && ((leftMB&&gameStarted)||space())){
      d.active=false;
      cart.dialogue.active=false;
    }
    if(d.wait>.3 && !d.done){
      d.done=true;
    }
}

function wrapText(ctx, txt, x, y, mw, lh) {
    let w = txt.split(' '), l = '', ly = y;
    for (let i = 0; i < w.length; i++) {
        let tl = l + w[i] + ' ';
        if (ctx.measureText(tl).width > mw && i > 0) {
            ctx.fillText(l, x, ly);
            l = w[i] + ' ';
            ly += lh;
        } else l = tl;
    }
    ctx.fillText(l, x, ly);
}

function tilesToAir(startRow, endRow, startCol, endCol, tiles, cols) {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      let id = row * cols + col;
      tiles[id].type = types.AIR;
      tiles[id].setType();
    }
  }
}

function tileToAir(id, tiles) {
  tiles[id-1].type = types.AIR;
  tiles[id-1].setType();
}
