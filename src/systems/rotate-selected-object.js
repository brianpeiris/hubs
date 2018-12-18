import { paths } from "./userinput/paths";
import { sets } from "./userinput/sets";

var gizmoMaterial = new THREE.MeshBasicMaterial({
  depthTest: false,
  depthWrite: false,
  transparent: true,
  side: THREE.DoubleSide,
  fog: false
});

var gizmoLineMaterial = new THREE.LineBasicMaterial({
  depthTest: false,
  depthWrite: false,
  transparent: true,
  linewidth: 1,
  fog: false
});

// Make unique material for each axis/color

var matInvisible = gizmoMaterial.clone();
matInvisible.opacity = 0.15;

var matHelper = gizmoMaterial.clone();
matHelper.opacity = 0.33;

var matRed = gizmoMaterial.clone();
matRed.color.set(0xff0000);

var matGreen = gizmoMaterial.clone();
matGreen.color.set(0x00ff00);

var matBlue = gizmoMaterial.clone();
matBlue.color.set(0x0000ff);

var matWhiteTransperent = gizmoMaterial.clone();
matWhiteTransperent.opacity = 0.25;

var matYellowTransparent = matWhiteTransperent.clone();
matYellowTransparent.color.set(0xffff00);

var matCyanTransparent = matWhiteTransperent.clone();
matCyanTransparent.color.set(0x00ffff);

var matMagentaTransparent = matWhiteTransperent.clone();
matMagentaTransparent.color.set(0xff00ff);

var matYellow = gizmoMaterial.clone();
matYellow.color.set(0xffff00);

var matLineRed = gizmoLineMaterial.clone();
matLineRed.color.set(0xff0000);

var matLineGreen = gizmoLineMaterial.clone();
matLineGreen.color.set(0x00ff00);

var matLineBlue = gizmoLineMaterial.clone();
matLineBlue.color.set(0x0000ff);

var matLineCyan = gizmoLineMaterial.clone();
matLineCyan.color.set(0x00ffff);

var matLineMagenta = gizmoLineMaterial.clone();
matLineMagenta.color.set(0xff00ff);

var matLineYellow = gizmoLineMaterial.clone();
matLineYellow.color.set(0xffff00);

var matLineGray = gizmoLineMaterial.clone();
matLineGray.color.set(0x787878);

var matLineYellowTransparent = matLineYellow.clone();
matLineYellowTransparent.opacity = 0.25;

// reusable geometry

var arrowGeometry = new THREE.CylinderBufferGeometry(0, 0.05, 0.2, 12, 1, false);

var scaleHandleGeometry = new THREE.BoxBufferGeometry(0.125, 0.125, 0.125);

var lineGeometry = new THREE.BufferGeometry();
lineGeometry.addAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

var CircleGeometry = function(radius, arc) {
  var geometry = new THREE.BufferGeometry();
  var vertices = [];

  for (var i = 0; i <= 64 * arc; ++i) {
    vertices.push(0, Math.cos((i / 32) * Math.PI) * radius, Math.sin((i / 32) * Math.PI) * radius);
  }

  geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  return geometry;
};

var gizmoRotate = {
  X: [
    [new THREE.Line(CircleGeometry(1, 0.5), matLineRed)],
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), matRed), [0, 0, 0.99], null, [1, 3, 1]]
  ],
  Y: [
    [new THREE.Line(CircleGeometry(1, 0.5), matLineGreen), null, [0, 0, -Math.PI / 2]],
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), matGreen), [0, 0, 0.99], null, [3, 1, 1]]
  ],
  Z: [
    [new THREE.Line(CircleGeometry(1, 0.5), matLineBlue), null, [0, Math.PI / 2, 0]],
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), matBlue), [0.99, 0, 0], null, [1, 3, 1]]
  ],
  E: [
    [new THREE.Line(CircleGeometry(1.25, 1), matLineYellowTransparent), null, [0, Math.PI / 2, 0]],
    [
      new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent),
      [1.17, 0, 0],
      [0, 0, -Math.PI / 2],
      [1, 1, 0.001]
    ],
    [
      new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent),
      [-1.17, 0, 0],
      [0, 0, Math.PI / 2],
      [1, 1, 0.001]
    ],
    [
      new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent),
      [0, -1.17, 0],
      [Math.PI, 0, 0],
      [1, 1, 0.001]
    ],
    [
      new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), matLineYellowTransparent),
      [0, 1.17, 0],
      [0, 0, 0],
      [1, 1, 0.001]
    ]
  ],
  XYZE: [[new THREE.Line(CircleGeometry(1, 1), matLineGray), null, [0, Math.PI / 2, 0]]]
};

var helperRotate = {
  AXIS: [[new THREE.Line(lineGeometry, matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], "helper"]]
};

var pickerRotate = {
  X: [
    [
      new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), matInvisible),
      [0, 0, 0],
      [0, -Math.PI / 2, -Math.PI / 2]
    ]
  ],
  Y: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), matInvisible), [0, 0, 0], [Math.PI / 2, 0, 0]]],
  Z: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), matInvisible), [0, 0, 0], [0, 0, -Math.PI / 2]]],
  E: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1.25, 0.1, 2, 24), matInvisible)]],
  XYZE: [[new THREE.Mesh(new THREE.SphereBufferGeometry(0.7, 10, 8), matInvisible)]]
};

var setupGizmo = function(gizmoMap) {
  var gizmo = new THREE.Object3D();

  for (var name in gizmoMap) {
    for (var i = gizmoMap[name].length; i--; ) {
      var object = gizmoMap[name][i][0].clone();
      var position = gizmoMap[name][i][1];
      var rotation = gizmoMap[name][i][2];
      var scale = gizmoMap[name][i][3];
      var tag = gizmoMap[name][i][4];

      // name and tag properties are essential for picking and updating logic.
      object.name = name;
      object.tag = tag;

      if (position) {
        object.position.set(position[0], position[1], position[2]);
      }
      if (rotation) {
        object.rotation.set(rotation[0], rotation[1], rotation[2]);
      }
      if (scale) {
        object.scale.set(scale[0], scale[1], scale[2]);
      }

      object.updateMatrix();

      var tempGeometry = object.geometry.clone();
      tempGeometry.applyMatrix(object.matrix);
      object.geometry = tempGeometry;

      object.position.set(0, 0, 0);
      object.rotation.set(0, 0, 0);
      object.scale.set(1, 1, 1);

      gizmo.add(object);
    }
  }

  return gizmo;
};

AFRAME.registerComponent("rotatable", {
  schema: {
      cursorController: { type: "selector" },
      eye: {type: "selector"},
  },
  init() {
    // Reusable utility variables

    var tempVector = new THREE.Vector3(0, 0, 0);
    var tempEuler = new THREE.Euler();
    var alignVector = new THREE.Vector3(0, 1, 0);
    var zeroVector = new THREE.Vector3(0, 0, 0);
    var lookAtMatrix = new THREE.Matrix4();
    var tempQuaternion = new THREE.Quaternion();
    var tempQuaternion2 = new THREE.Quaternion();
    var identityQuaternion = new THREE.Quaternion();

    var unitX = new THREE.Vector3(1, 0, 0);
    var unitY = new THREE.Vector3(0, 1, 0);
    var unitZ = new THREE.Vector3(0, 0, 1);

    // Gizmo creation

    this.el.object3D.gizmo = {};
    this.el.object3D.picker = {};
    this.el.object3D.helper = {};

    this.el.object3D.add((this.el.object3D.gizmo["rotate"] = setupGizmo(gizmoRotate)));
    this.el.object3D.add((this.el.object3D.picker["rotate"] = setupGizmo(pickerRotate)));
    this.el.object3D.add((this.el.object3D.helper["rotate"] = setupGizmo(helperRotate)));

    //////////////////////////////////////////////////

    this.onGrabStart = this.onGrabStart.bind(this);
    this.onGrabEnd = this.onGrabEnd.bind(this);
    this.el.addEventListener("grab-start", this.onGrabStart);
    this.el.addEventListener("grab-end", this.onGrabEnd);
    this.hand = null;
  },

  onGrabStart(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.hand = e.detail.hand;
  },

  onGrabEnd(e) {
    if (this.hand === e.detail.hand) {
      e.preventDefault();
      e.stopPropagation();
      this.hand = null;
    }
  },

  tick() {
    const cursorController = this.data.cursorController;

    const userinput = AFRAME.scenes[0].systems.userinput;
    let interactorOne, interactorTwo;
    if (this.hand) {
      if (this.hand.id === "player-left-controller" && userinput.get(paths.actions.rotateLeftHandSelection)) {
        const q = userinput.get(paths.actions.leftHandSelectionRotation);
        const q2 = new THREE.Quaternion(q.x, q.z, q.y, q.w);
        this.el.object3D.rotation.setFromQuaternion(q2);
        this.el.object3D.picker["rotate"].visible = true;
      } else if (
        (this.hand.id === "player-right-controller" || this.hand.id === "cursor") &&
        userinput.get(paths.actions.rightHandRotationActive)
      ) {
        this.el.object3D.picker["rotate"].visible = true;
        const q = userinput.get(paths.actions.cursor.pose).orientation;
        this.el.object3D.rotation.setFromQuaternion(q);
      } else {
        this.el.object3D.picker["rotate"].visible = false;
      }
    } else {
      this.el.object3D.picker["rotate"].visible = false;
    }

    userinput.toggleSet(sets.leftHandHoldingRotatable, this.hand && this.hand.id === "player-left-controller");
    userinput.toggleSet(
      sets.rightHandHoldingRotatable,
      this.hand && (this.hand.id === "player-right-controller" || this.hand.id === "cursor")
    );

    const { hoverers } = this.el.components["hoverable"];
    for (const hoverer of hoverers) {
      if (hoverer.id === "player-left-controller") {
        interactorOne = hoverer.object3D;
      } else if (hoverer.id === "cursor") {
        if (this.data.cursorController.components["cursor-controller"].enabled) {
          interactorTwo = hoverer.object3D;
        }
      } else if (hoverer.id === "player-right-controller") {
        if (!this.data.cursorController.components["cursor-controller"].enabled) {
          interactorTwo = hoverer.object3D;
        }
      }
    }
    userinput.toggleSet(sets.leftHandHoveringOnRotatable, !!interactorOne);
    userinput.toggleSet(sets.rightHandHoveringOnRotatable, !!interactorTwo);

    userinput.toggleSet(
      sets.leftHandRotationActive,
      this.hand && this.hand.id === "player-left-controller" && userinput.get(paths.actions.leftHandRotationActive)
    );
    userinput.toggleSet(
      sets.rightHandRotationActive,
      this.hand &&
        (this.hand.id === "player-right-controller" || this.hand.id === "cursor") &&
            userinput.get(paths.actions.rightHandRotationActive)
    );
  }
});
