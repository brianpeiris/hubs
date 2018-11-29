import { paths } from "./userinput/paths";

export class Rotatable {
  init(object3D, transformControls) {
    this.object3D = object3D;
    this.transformControls = transformControls;
    transformControls.state.rotatables.push(this);
  }
  remove() {
    this.transformControls.state.rotatables.splice(this.transformControls.state.rotatables.indexOf(this), 1);
  }
}

export class TransformControls {
  init() {
    this.state = {
      paths: {
        displayControlsWidget: {
          right: paths.actions.rightHand.displayTransformControlsWidget,
          left: paths.actions.leftHand.displayTransformControlsWidget,
          cursor: paths.actions.cursor.displayTransformControlsWidget
        },
        rotation: {
          right: paths.actions.rightHand.transformControlsRotation,
          left: paths.actions.leftHand.transformControlsRotation,
          cursor: paths.actions.cursor.transformControlsRotation
        },
        initialRotation: {
          right: paths.actions.rightHand.transformControlsInitialRotation,
          left: paths.actions.leftHand.transformControlsInitialRotation,
          cursor: paths.actions.cursor.transformControlsInitialRotation
        }
      },
      superhands: {
        right: null,
        left: null,
        cursor: null
      },
      rotatables: [],

      controlsWidgets: { right: null, left: null, cursor: null }
    };
  }
  tick() {
    this.state.userinput = this.state.userinput || AFRAME.scenes[0].systems.userinput;
    this.state.superhands.right =
      this.state.superhands.right || document.querySelector("#player-right-controller").components["super-hands"];
    this.state.superhands.left =
      this.state.superhands.left || document.querySelector("#player-left-controller").components["super-hands"];
    this.state.superhands.cursor =
      this.state.superhands.cursor || document.querySelector("#cursor").components["super-hands"];

    const userinput = this.state.userinput;
    const hands = ["right", "left", "cursor"];
    const { paths, superhands, controlsWidgets, rotatables } = this.state;

    for (const hand of hands) {
      //controlsWidgets[hand].shouldDisplay = userinput.get(paths.displayControlsWidget[hand]);

      const superhand = superhands[hand];

      if (superhand.state.has("grab-start")) {
        const grabbed = superhand.state.get("grab-start");
        for (let i = 0; i < rotatables.length; i++) {
          const rotatable = rotatables[i];
          if (grabbed.object3D === rotatable.object3D) {
            const rotation = userinput.get(paths.rotation[hand]);
            const initialRotation = userinput.get(paths.initialRotation[hand]);
            if (rotation && initialRotation) {
              rotatable.object3D.setRotationFromQuaternion(
                initialRotation.orientation
                  .clone()
                  .conjugate()
                  .multiply(rotation.orientation)
              );
              rotatable.object3D.matrixNeedsUpdate = true;
            }
          }
        }
      }
    }
  }
}

AFRAME.registerComponent("rotating", {
  schema: {
    hand: { type: "string" }
  },
  tick() {}
});

AFRAME.registerComponent("rotatable", {
  init() {
    window.setTimeout(() => {
      console.log("setting rotatable in system");
      this.rotatable = new Rotatable();
      this.rotatable.init(this.el.object3D, AFRAME.scenes[0].systems["transform-controls-system"].transformControls);
    }, 3000);
  },
  onGrabStart(e) {
    if (AFRAME.scenes[0].systems.userinput.get(paths.actions.rotationMode)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  },
  onGrabEnd(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  play() {
    this.el.addEventListener("grab-start", this.onGrabStart);
    this.el.addEventListener("grab-end", this.onGrabEnd);
  },
  pause() {
    this.el.removeEventListener("grab-start", this.onGrabStart);
    this.el.removeEventListener("grab-end", this.onGrabEnd);
  },
  remove() {
    this.rotatable.remove();
  }
});

AFRAME.registerSystem("transform-controls-system", {
  init() {
    this.transformControls = new TransformControls();
    this.transformControls.init();
  },
  tick() {
    this.transformControls.tick();
  }
});
