import { paths } from "./userinput/paths";
import { sets } from "./userinput/sets";

export function init() {
  let parent = null;
  let visible = false;
  const eye = new THREE.Vector3();
  const gizmo = new RotationGizmo();
  const plane = new Plane();
  return {
    tick: function() {}
  };
}

function RotationGizmo() {
  return {
    root: new THREE.Object3D()
  };
}

function Plane() {
  return {
    mesh: new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100000, 100000, 2, 2),
      new THREE.MeshBasicMaterial({
        visible: false,
        writeframe: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1
      })
    )
  };
}

AFRAME.registerSystem("rotatable", {
  init() {
    this.componentData = {};
    AFRAME.scenes[0].rotatables = AFRAME.scenes[0].rotatables || [];
    AFRAME.scenes[0].rotatables.push(this.componentData);
    this.onHoverStart = this.onHoverStart.bind(this);
    this.onHoverEnd = this.onHoverEnd.bind(this);
  },

  onHoverStart(e) {
    const hand = e.detail.hand;
    const controls = AFRAME.scenes[0].systems["rotation-controls"];
    if (hand.id === LEFT && !controls.rotationTarget2) {
      e.preventDefault();
      e.preventImmediatePropagation();
      controls.rotationTarget2 = this;
    } else if ((hand.id === RIGHT || hand.id === CURSOR) && !controls.rotationTarget1) {
      controls.rotationTarget1 = this;
      e.preventDefault();
      e.preventImmediatePropagation();
    }
  },

  onHoverEnd(e) {},

  play() {
    this.el.addEventListener("hover-start", this.onHoverStart);
    this.el.addEventListener("hover-end", this.onHoverEnd);
  },

  pause() {
    this.el.removeEventListener("hover-start", this.onHoverStart);
    this.el.removeEventListener("hover-end", this.onHoverEnd);
  }
});

const LEFT = "player-left-controller";
const RIGHT = "player-right-controller";
const CURSOR = "cursor";

AFRAME.registerSystem("rotation-controls", {
  init() {
    this.parent = null;
    this.visible = false;
    this.eye1 = new THREE.Vector3();
    this.eye2 = new THREE.Vector3();
    this.gizmo1 = new RotationGizmo();
    this.gizmo2 = new RotationGizmo();
    this.plane1 = new Plane();
    this.plane2 = new Plane();

    this.leftHand = document.querySelector(`#${LEFT}`).components["super-hands"];
    this.rightHand = document.querySelector(`#${RIGHT}`).components["super-hands"];
    this.cursorHand = document.querySelector(`#${CURSOR}`).components["super-hands"];

    this.differenceFromInput1 = new THREE.Quaternion();
    this.differenceFromInput2 = new THREE.Quaternion();

    this.initialObjOrientation1 = new THREE.Quaternion();
    this.currentObjOrientation1 = new THREE.Quaternion();
  },

  tick() {
    const ui = AFRAME.scenes[0].systems.userinput;

    const displayRotationGizmo1 = ui.get(paths.actions.displayRotationGizmo1);
    const beginRotation1 = ui.get(paths.actions.beginRotation1);
    const cancelRotation1 = ui.get(paths.actions.cancelRotation1);
    const endRotation1 = ui.get(paths.actions.endRotation1);
    const initialOrientation1 = ui.get(paths.actions.initialOrientation1);
    const currentOrientation1 = ui.get(paths.actions.currentOrientation1);

    const displayRotationGizmo2 = ui.get(paths.actions.displayRotationGizmo2);
    const beginRotation2 = ui.get(paths.actions.beginRotation2);
    const cancelRotation2 = ui.get(paths.actions.cancelRotation2);
    const endRotation2 = ui.get(paths.actions.endRotation2);
    const initialOrientation2 = ui.get(paths.actions.initialOrientation2);
    const currentOrientation2 = ui.get(paths.actions.currentOrientation2);

    if (!this.rotation1Target) {
      this.rotation1Target =
        this.cursorHand.state.has("hover-start") && this.cursorHand.state.get("hover-start").components["rotatable"];
    }

    this.gizmo1.visible = displayRotationGizmo1 && this.rotation1Target;

    const gizmo1Root = this.gizmo1.root;
    gizmo1Root.up.copy(this.rotation1Target.el.object3D.up);

    gizmo1Root.position.copy(this.rotation1Target.el.object3D.position);
    gizmo1Root.quaternion.copy(this.rotation1Target.el.object3D.quaternion);
    gizmo1Root.scale.copy(this.rotation1Target.el.object3D.scale);

    this.matrix.copy(this.rotation1Target.el.object3D.matrix);
    this.matrixWorld.copy(this.rotation1Target.el.object3D.matrixWorld);

    if (this.rotation1InProgress) {
      if (cancelRotation1) {
        this.rotation1Target.el.object3D.setRotationFromQuaternion(this.initialObjOrientation1);
        this.rotation1InProgress = false;
        this.rotation1Target = null;
      } else {
        quaternionDifference(initialOrientation1, currentOrientation1, this.differenceFromInput1);
        this.currentObjOrienation1
          .copy(this.initialObjOrientation1)
          .inverse()
          .applyQuaternion(this.differenceFromInput1);
        this.rotation1Target.el.object3D.setRotationFromQuaternion(this.currentObjOrientation1);
        if (endRotation1) {
          this.rotation1Target = null;
          this.rotation1InProgress = false;
        }
      }
    } else {
      this.rotation1InProgress = beginRotation1 && !!this.rotation1Target;
      if (this.rotation1InProgress) {
        this.initialObjOrientation1.copy(this.rotation1Target.el.object3D.quaternion);
      }
    }
  }
});

const quaternionDifference = (() => {
  const q = new THREE.Quaternion();
  return function quaternionDifference(from, to, out) {
    return out.copy(to).applyQuaternion(q.copy(from).inverse());
  };
})();
