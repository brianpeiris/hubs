import { paths } from "../systems/userinput/paths";
import { sets } from "../systems/userinput/sets";

AFRAME.registerComponent("rotate-object-button", {
  schema: {},
  init() {
    this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100000, 100000, 2, 2),
      new THREE.MeshBasicMaterial({
        visible: true,
        writeframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
      })
    );
    this.el.sceneEl.object3D.add(this.plane);
    this.onClick = e => {
      this.grabbed = true;
      this.hand = e.detail.hand;
      this.initialQuaternion = this.el.parentNode.parentNode.parentNode.object3D.quaternion.clone();
      this.initialCursorPosition = document.querySelector("#cursor").object3D.position.clone();
      this.plane.position.copy(this.el.object3D.getWorldPosition());
      this.plane.lookAt(document.querySelector("#player-camera").object3D.getWorldPosition());
      this.plane.matrixNeedsUpdate = true;

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
    AFRAME.scenes[0].systems.userinput.toggleSet(sets.rotatingObjectWithCursor, this.grabbed);
    if (this.grabbed) {
      this.plane.lookAt(document.querySelector("#player-camera").object3D.getWorldPosition());
      this.plane.matrixNeedsUpdate = true;
      this.el.parentNode.parentNode.parentNode.object3D.quaternion.copy(this.initialQuaternion);
      const cX = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[0];
      const cY = AFRAME.scenes[0].systems.userinput.get(paths.device.mouse.coords)[1];
      // const dx = document.querySelector("#cursor").object3D.position.x - this.initialCursorPosition.x;
      // const dy = document.querySelector("#cursor").object3D.position.y - this.initialCursorPosition.y;
      const dx = cX - this.iX;
      const dy = -cY + this.iY;
      const threshold = 0.3;
      if (Math.abs(dx) > Math.abs(dy)) {
          this.el.parentNode.parentNode.parentNode.object3D.rotateY(dx);//rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), dx);
      } else {
        this.el.parentNode.parentNode.parentNode.object3D.rotateX(dy);
      }
    }
  }
});
