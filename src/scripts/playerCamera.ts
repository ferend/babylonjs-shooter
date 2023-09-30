import * as BABYLON from "@babylonjs/core";

class PlayerCamera extends BABYLON.FreeCamera {
  constructor(scene, canvas) {
    super("FreeCamera", new BABYLON.Vector3(0, 20, 0), scene);

   this.setTarget(new BABYLON.Vector3(0, -1, 0));
    this.attachControl(canvas, true);
    this.minZ = 0.45;

    // Targets the camera to a particular position. In this case the scene origin
    this.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    this.applyGravity = true;
    this.checkCollisions = true;
    this.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    this.position.y = 1
    this.attachControl(canvas, true);
  }
}
export default PlayerCamera