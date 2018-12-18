import { paths } from "../systems/userinput/paths";
AFRAME.registerComponent("rotate-object-button", {
  schema: {},
  init() {
    this.onClick = e => {
      this.grabbed = true;
      this.hand = e.detail.hand;
      this.initialQuaternion = this.el.parentNode.parentNode.parentNode.object3D.quaternion.clone();
      this.initialCursorPosition = document.querySelector("#cursor").object3D.position.clone();

      this.iX = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[0];
      this.iY = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[1];
      e.stopImmediatePropagation();
    };
  },

  play() {
    this.el.addEventListener("grab-start", this.onClick);
  },

  pause() {
    this.el.removeEventListener("grab-start", this.onClick);
  },

  tick() {
    if (this.grabbed && !AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.buttonLeft)) {
      this.grabbed = false;
    }
    if (this.grabbed) {
      this.el.parentNode.parentNode.parentNode.object3D.quaternion.copy(this.initialQuaternion);
      const cX = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[0];
      const cY = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[1];
      // const dx = document.querySelector("#cursor").object3D.position.x - this.initialCursorPosition.x;
      // const dy = document.querySelector("#cursor").object3D.position.y - this.initialCursorPosition.y;
      const dx = cX - this.iX;
      const dy = -cY + this.iY;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.el.parentNode.parentNode.parentNode.object3D.rotateY(dx);
      } else {
        this.el.parentNode.parentNode.parentNode.object3D.rotateX(dy);
      }
    }
  }
});
