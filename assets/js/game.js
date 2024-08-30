// ╔══════════════════════════════════╗
// ║ JS13K template by @CarelessLabs  ║
// ╚══════════════════════════════════╝

// Reference for new atlas
let canvasW = window.innerWidth;
let canvasH = window.innerHeight;
let gameStarted = false;
let charSet=0;
let delta = 0.0;
let prevDelta = Date.now();
let currentDelta = Date.now();
let TIME = 0;
let mousePos = new vec2(0,0);
let clickedAt = new vec2(0,0);
let clickedRec = new rectanlge(0,0,0,0);
let processClick = false;
let GAMEOVER=false;
let RELOAD=false;
let WIN = false;
let STAGE=0;
let atlas = new Image();
atlas.src = "atlas.png";
let cart = new Cart();
let start=false;
let music=false;
let pause=false;
let leftMB=false;
let rightMB=false;
let startDelay=0.1;
let zoom=4;
let fps = 60; // default value
let frameCount = 0;
let elapsedTime = 0;
let startX = 0;//canvasW / 2;
let startY = 0;//canvasH;
let a = navigator.userAgent;
let check = a.match(/Android/i)!=null||a.match(/iPhone/i)!=null||a.match(/iPad/i)!=null;
var nativeWidth = 812;  // The resolution the game is designed to look best in
var nativeHeight = check?375:470;
var scaleFillNative = Math.max(canvasW / nativeWidth, canvasH / nativeHeight);
let shaky = true;
let loading = .2;
let debug=true;
let block = new Entity(32, 16, 0, 0, 0, types.BLOCK);
let swipeWidth = 0;
let shrinking = false;

// Load the music player
genAudio();

// Called by body onload on index page
function startGame() {
  mg.start();
  resizeCanvas(this.ctx);
  setupControls();
  document.getElementById('gameControls').addEventListener('touchstart', (event) => {
      event.preventDefault();  // Prevent scrolling/zooming on the control buttons
  }, { passive: false });

}

let mg = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = nativeWidth * scaleFillNative;
    this.canvas.height = nativeHeight * scaleFillNative;
    this.context = this.canvas.getContext("2d");
    this.context.scale(1, 1);
    this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);
    const gl = this.canvas.getContext("webgl");
    // PixelArt Sharp
    ctx=this.context;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.canvas.classList.add("screen");
    document.body.insertBefore(this.canvas, document.body.childNodes[6]);

    // Run the game loop
    this.frameId = requestAnimationFrame(updateGameLoop);

    //Mobile
    window.addEventListener('touchstart', function(e) {
      if(!music){
        music=true
        audio.loop=true;
        //audio.play();
        if(audioCtx == null) audioCtx = new AudioContext();
      }
      if(startDelay<=0&&charSet==3)start=true;
      e.preventDefault();
    })

    // Keyboard
    window.addEventListener('keydown', function(e) {
      if(!music){
        music=true
        audio.loop=true;
        //audio.play();
        if(audioCtx == null) audioCtx = new AudioContext();
      }
      if(startDelay<=0&&charSet==3)start=true;
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      mg.keys[e.keyCode] = (e.type == "keydown");
      if(e.keyCode==R) RELOAD=true;
      if(e.keyCode==M) pause=!pause;
      if(e.keyCode==T) cart.tips=!cart.tips;
    })
    window.addEventListener('mouseup', function(e) {
      e.preventDefault();
      setclicks();

      if (e.button === 0) {
        leftMB=false;
      } else if (e.button === 2) {
        rightMB=false;
      }
    })
    window.addEventListener('mousedown', function(e) {
      e.preventDefault();
      if (e.button === 0) {
        leftMB=true;
      } else if (e.button === 2) {
        rightMB=true;
      }
    })
    // Add an event listener for window resize.
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(e) {
      e.preventDefault();
      var r = mg.canvas.getBoundingClientRect();
      mousePos.set((e.clientX - r.left) / (r.right - r.left) * canvasW,
                   (e.clientY - r.top) / (r.bottom - r.top) * canvasH);
    })
    // Disable right click context menu
    this.canvas.oncontextmenu = function(e) {
      e.preventDefault();
    };
  },
  stop: function() {
    if (mg.frameId) {
      cancelAnimationFrame(mg.frameId);
      // Reset the frameId
      mg.frameId = null;
    }
  },
  clear: function() {
    this.context.clearRect(0, 0, 4*this.canvas.width, 4*this.canvas.height);
  }
}

// Mobile Controls
function setupControls() {
    document.getElementById('up').addEventListener('touchstart', () => move('up'));
    document.getElementById('up').addEventListener('touchend', () => stopmove('up'));
    document.getElementById('down').addEventListener('touchstart', () => move('down'));
    document.getElementById('down').addEventListener('touchend', () => stopmove('down'));
    document.getElementById('left').addEventListener('touchstart', () => move('left'));
    document.getElementById('left').addEventListener('touchend', () => stopmove('left'));
    document.getElementById('right').addEventListener('touchstart', () => move('right'));
    document.getElementById('right').addEventListener('touchend', () => stopmove('right'));
    document.getElementById('aButton').addEventListener('touchstart', () => action('A'));
    document.getElementById('fsButton').addEventListener('touchend', () => toggleFull());
    document.getElementById('fsButton').addEventListener('mouseup', () => toggleFull());
}

function toggleFull() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function action(button) {
    // Handle action button logic here
    if(!gameStarted){
      gameStarted=true;
    }
    processClick=true;
}

let lastTimestamp = null;
function updateGameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;

  // Calculate the delta time (in seconds)
  let deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // Update the FPS every second
  elapsedTime += deltaTime;
  frameCount++;
  if (elapsedTime >= 1.0) { // Update the FPS once every second
    fps = frameCount / elapsedTime;
    frameCount = 0;
    elapsedTime = 0;
  }

  // Update the game state and render
  updateGameArea(deltaTime);

  // Display FPS
  if(debug) displayFPS(fps);

  // Request the next frame
  mg.frameId = requestAnimationFrame(updateGameLoop);
}

function updateGameArea(delta) {
  if(GAMEOVER){
    TIME=0;
    GAMEOVER=false;
    WIN=false;
    STAGE=0;
    start=false;
    gameStarted=false;
    startDelay=3;
  }

  if(start) gameStarted=true;
  if(startDelay>0)startDelay-=delta;
  cart.update(delta, gameStarted);

  // Reset Click to false
  // If it is still true on the next loop could cause an unexpected action
  processClick=false;
}

function left() {return (mg.keys && (mg.keys[LEFT] || mg.keys[A]));}
function right() {return (mg.keys && (mg.keys[RIGHT] || mg.keys[D]));}
function up() {return (mg.keys && (mg.keys[UP] || mg.keys[W]));}
function down() {return (mg.keys && (mg.keys[DOWN] || mg.keys[S]));}
function space() {return (mg.keys && mg.keys[SPACE]);}
function shift() {return (mg.keys && mg.keys[SHIFT]) || rightMB;}
function t() {return mg.keys && (mg.keys[T]);}

function setclicks(){
  clickedAt.set(mousePos.x, mousePos.y);
  clickedRec.x=mousePos.x-1;
  clickedRec.y=mousePos.y+1;
  clickedRec.h=2;
  clickedRec.w=2;
}

function resizeCanvas() {
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  scaleFillNative = Math.max(canvasW / nativeWidth, canvasH / nativeHeight);
  scaleFitNative = Math.min(canvasW / nativeWidth, canvasH / nativeHeight);
  ctx.canvas.width = nativeWidth * scaleFillNative;
  ctx.canvas.height = nativeHeight * scaleFillNative;
  this.context = ctx.canvas.getContext("2d");
  this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);
  this.ctx.mozImageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.imageSmoothingEnabled = false;
}
