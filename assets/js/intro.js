function Intro(){
  let delay=0;
  let selectDelay=0;
  let offset=0;

  this.update = function(delta) {
    let fontSize=getResponsiveFontSize(.05);
    mg.clear();
    ctx.save();
    drawBox(ctx,0.8,"black",0,0,canvasW,canvasH)

    // BACKGROUND STRIPES
    var colors=['#5b2c6f', '#17202a'];
    const stripeWidth = 100; // width of each stripe
    let colorIndex = 0;

    // Calculate the number of stripes needed to fill the screen diagonally
    const numStripes = Math.ceil(Math.sqrt(ctx.canvas.width**2 + ctx.canvas.height**2) / stripeWidth);

    for (let i = -numStripes; i < numStripes + 10; i++) {
      ctx.fillStyle = colors[i % 2];
      ctx.beginPath();
      ctx.moveTo((i * stripeWidth) + offset, 0);
      ctx.lineTo((i + 1) * stripeWidth + offset, 0);
      ctx.lineTo((i + 1) * stripeWidth + offset - ctx.canvas.height, ctx.canvas.height);
      ctx.lineTo((i * stripeWidth) + offset - ctx.canvas.height, ctx.canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    offset -= .3; // Change the speed of the stripe movement by adjusting this value
    if (offset <= -stripeWidth*2) offset = 0;
    let font=`${fontSize}px Arial`;
    writeStroke(ctx, 1, font,"Black","13 Floors", 30, canvasH*.1,12);
    writeTxt(ctx, 1, font,"WHITE","13 Floors", 30, canvasH*.1);
    font=`${fontSize-15}px Arial`;
    charSet = (charSet + 3) % 3;
    drawHeroBox(15);
    delay-=delta;
    // cart.hero.e.x=60;
    // cart.hero.e.y=200;
    ctx.save();
    ctx.scale(3,3);
    cart.hero.update(delta);
    ctx.restore();

    // Start Text
    let bottomOffset = 30;
    let viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    let textY = viewportHeight - bottomOffset; // Position text 30px above the bottom edge of the viewport

    if(loading <=0){
      if(space())gameStarted=true;
      writeCentre(ctx, "Space to Start", font, canvasW / 2, viewportHeight - bottomOffset)
    } else {
      loading-=delta;
      writeCentre(ctx, "Loading Pixels", font, canvasW / 2, viewportHeight - bottomOffset)
    }
  }
}
