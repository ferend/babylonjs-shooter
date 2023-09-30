import * as BABYLON from "@babylonjs/core";

class GameEnvironment {
  constructor(scene) {
    var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
    border0.scaling = new BABYLON.Vector3(5, 100, 200);
    border0.position.x = -100.0;
    border0.checkCollisions = true;
    border0.isVisible = false;

    var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
    border1.scaling = new BABYLON.Vector3(5, 100, 200);
    border1.position.x = 100.0;
    border1.checkCollisions = true;
    border1.isVisible = false;

    var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
    border2.scaling = new BABYLON.Vector3(200, 100, 5);
    border2.position.z = 100.0;
    border2.checkCollisions = true;
    border2.isVisible = false;

    var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
    border3.scaling = new BABYLON.Vector3(200, 100, 5);
    border3.position.z = -100.0;
    border3.checkCollisions = true;
    border3.isVisible = false;

    border0.physicsImpostor = new BABYLON.PhysicsImpostor(
      border0,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    border1.physicsImpostor = new BABYLON.PhysicsImpostor(
      border1,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    border2.physicsImpostor = new BABYLON.PhysicsImpostor(
      border2,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    border3.physicsImpostor = new BABYLON.PhysicsImpostor(
      border3,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
  }
}
export default GameEnvironment
