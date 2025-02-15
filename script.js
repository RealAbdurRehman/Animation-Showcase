import InputHandler from "./InputHandler.js";

window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingContent = document.querySelector(".loading-content");

  loadingContent.innerHTML = "<h1>Loaded!</h1>";
  setTimeout(() => {
    loadingScreen.style.opacity = 0;
  }, 750);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = window.innerWidth);
  const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

  const player = createPlayer();
  const inputHandler = new InputHandler();

  let imageToShow = 0;
  let animationToShow = 0;
  let gameFrame = 0;
  const frameStagger = 2;
  const spriteAnimations = [
    {
      name: "idle",
      frame: Array.from({ length: 20 }, (_, i) =>
        document.getElementById(`idle${i + 1}`)
      ),
    },
    {
      name: "punching",
      frame: Array.from({ length: 10 }, (_, i) =>
        document.getElementById(`punching${i + 1}`)
      ),
    },
    {
      name: "running",
      frame: Array.from({ length: 25 }, (_, i) =>
        document.getElementById(`running${i + 1}`)
      ),
    },
  ];

  function createPlayer() {
    const height = 736 * 0.5;
    return {
      width: 799 * 0.5,
      height: height,
      isMoving: false,
      isPunching: false,
      facingLeft: false,
      image: document.getElementById("idle1"),
      position: { x: 0, y: CANVAS_HEIGHT - height },
    };
  }

  function movePlayer() {
    const keys = inputHandler.keys;

    if (keys.includes("KeyA") || keys.includes("ArrowLeft")) {
      player.position.x -= player.isPunching ? 0.5 : 7;
      animationToShow = 2;
      player.isMoving = true;
      player.facingLeft = true;
    } else if (keys.includes("KeyD") || keys.includes("ArrowRight")) {
      player.position.x += player.isPunching ? 0.5 : 7;
      animationToShow = 2;
      player.isMoving = true;
      player.facingLeft = false;
    } else {
      animationToShow = 0;
      player.isMoving = false;
    }

    if (keys.includes("KeyF")) {
      animationToShow = 1;
      player.isPunching = true;
    } else player.isPunching = false;

    handleBoundaries();
  }

  function handleBoundaries() {
    if (player.position.x <=  -player.width * 0.35) {
      player.position.x = -player.width * 0.35;
      animationToShow = player.isPunching ? 1 : 0;
    } else if (player.position.x >= CANVAS_WIDTH - player.width * 0.65) {
      player.position.x = CANVAS_WIDTH - player.width * 0.65;
      animationToShow = player.isPunching ? 1 : 0;
    }
  }

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    if (player.facingLeft) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        player.image,
        -player.position.x - player.width,
        player.position.y,
        player.width,
        player.height
      );
    } else {
      ctx.drawImage(
        player.image,
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );
    }

    ctx.restore();

    movePlayer();

    const currentAnimation = spriteAnimations[animationToShow].frame;
    if (gameFrame % frameStagger === 0) {
      if (imageToShow < currentAnimation.length) {
        player.image = currentAnimation[imageToShow];
        imageToShow++;
      } else {
        imageToShow = 0;
      }
    }

    gameFrame++;
    requestAnimationFrame(animate);
  }
  animate();
});
