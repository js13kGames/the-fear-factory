function draw() {
  let w = canvasW;
  let h = canvasH;

  // Clear the canvas before drawing
  ctx.save();
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, swipeWidth, h);
  ctx.restore();

  if (!shrinking) {
    swipeWidth += 20;
    if (swipeWidth >= nativeWidth+100) {
      shrinking = true;
      cart.changeLvl=true;
      cart.cLevel++;
    }
  } else {
    swipeWidth -= 20;
    if (swipeWidth <= 0) {
      swipeWidth = 0;
      shrinking = false;
      cart.hero.hasKey=false;
    }
  }
}
