function Intro(){
  let delay=0;
  let selectDelay=0;
  let offset=0;
  let textPhase=0;

  this.update = function(delta) {
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
    drawHeroBox(15);
    delay-=delta;
    cart.hero.e.x=70;
    cart.hero.e.y=20;
    ctx.save();
    ctx.scale(3,3);
    cart.hero.update(delta);
    ctx.restore();

    if(loading <=0){
      if(space()){
        gameStarted=true;
        cart.hero.e.x=70;
        cart.hero.e.y=-20;
      }
      if(textPhase==1){
        if(!check){
          textToScreen("Press Space");
        } else {
          textToScreen("Press A");
        }
        textPhase++;
      }
    } else {
      loading-=delta;
      if(textPhase==0){
        textToScreen("Loading Fears . . .");
        textPhase++;
      }
    }
  }
}
