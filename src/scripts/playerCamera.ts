import * as BABYLON from "@babylonjs/core";

class PlayerCamera extends BABYLON.UniversalCamera {
  constructor(scene, canvas) {
    super("UniversalCamera", new BABYLON.Vector3(0, 2, -25), scene);

    // Targets the camera to a particular position. In this case the scene origin
    this.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    this.applyGravity = true;
    this.ellipsoid = new BABYLON.Vector3(0.4, 0.8, 0.4);
    this.checkCollisions = true;
    this.attachControl(canvas, true);
  }
}
export default PlayerCamera