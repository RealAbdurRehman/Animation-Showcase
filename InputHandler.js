export default class InputHandler {
  constructor() {
    this.keys = [];

    this.addListeners();
  }
  addListeners() {
    window.addEventListener("keydown", ({ code }) => {
      if (!this.keys.includes(code)) {
        switch (code) {
          case "KeyA":
          case "KeyD":
          case "KeyF":
          case "ArrowLeft":
          case "ArrowRight":
            this.keys.push(code);
            break;
        }
      }
    });
    window.addEventListener("keyup", ({ code }) => {
      if (this.keys.includes(code)) {
        this.keys.splice(this.keys.indexOf(code), 1);
      }
    });
  }
}