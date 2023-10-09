import * as BABYLON from "@babylonjs/core";

class PlayerGun {
  constructor(scene) {
    this.addGunSight(scene);
  }

  public calculateShoot(
    scene,
    camera,
    playerWrapper,
    characterHeight,
    callback: Function
  ) {
    // left click (can't find enum)
    const origin = playerWrapper
      .getAbsolutePosition()
      .subtract(new BABYLON.Vector3(0, -characterHeight, 0));

    const ray = camera.getForwardRay(undefined, undefined, origin);

    const raycastHit = scene.pickWithRay(ray);

    const cameraDirection = camera.getDirection(BABYLON.Vector3.Forward());

    const ball = BABYLON.CreateSphere("ball", { diameter: 0.1 });
    ball.position = origin;

    ball.physicsImpostor = new BABYLON.PhysicsImpostor(
      ball,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 0.2,
      }
    );

    ball.physicsImpostor.applyImpulse(
      cameraDirection.scale(20),
      ball.getAbsolutePosition()
    );

    ball.physicsImpostor.onCollideEvent = (collider, collidedWith) => {
      setTimeout(() => {
        ball.dispose();

        const collidedMesh = collidedWith.object as BABYLON.Mesh;

        if (collidedMesh.id === "Sphere") {
          // Remove the physics impostor before disposing of the mesh
          collidedWith.dispose();
          collidedMesh.dispose();
          collidedMesh.isVisible = false;
          callback();
        }
      }, 0);
    };
  }

  private addGunSight(scene): void {
    if (scene.activeCameras.length === 0) {
      scene.activeCameras.push(scene.activeCamera);
    }
    var secondCamera = new BABYLON.FreeCamera(
      "GunSightCamera",
      new BABYLON.Vector3(0, 0, -50),
      scene
    );
    secondCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    secondCamera.layerMask = 0x20000000;
    scene.activeCameras.push(secondCamera);

    var meshes = [];
    var h = 250;
    var w = 250;

    var y = BABYLON.Mesh.CreateBox("y", h * 0.2, scene);
    y.scaling = new BABYLON.Vector3(0.05, 1, 1);
    y.position = new BABYLON.Vector3(0, 0, 0);
    meshes.push(y);

    var x = BABYLON.Mesh.CreateBox("x", h * 0.2, scene);
    x.scaling = new BABYLON.Vector3(1, 0.05, 1);
    x.position = new BABYLON.Vector3(0, 0, 0);
    meshes.push(x);

    var lineTop = BABYLON.Mesh.CreateBox("lineTop", w * 0.8, scene);
    lineTop.scaling = new BABYLON.Vector3(1, 0.005, 1);
    lineTop.position = new BABYLON.Vector3(0, h * 0.5, 0);
    meshes.push(lineTop);

    var lineBottom = BABYLON.Mesh.CreateBox("lineBottom", w * 0.8, scene);
    lineBottom.scaling = new BABYLON.Vector3(1, 0.005, 1);
    lineBottom.position = new BABYLON.Vector3(0, h * -0.5, 0);
    meshes.push(lineBottom);

    var lineLeft = BABYLON.Mesh.CreateBox("lineLeft", h, scene);
    lineLeft.scaling = new BABYLON.Vector3(0.01, 1, 1);
    lineLeft.position = new BABYLON.Vector3(w * -0.4, 0, 0);
    meshes.push(lineLeft);

    var lineRight = BABYLON.Mesh.CreateBox("lineRight", h, scene);
    lineRight.scaling = new BABYLON.Vector3(0.01, 1, 1);
    lineRight.position = new BABYLON.Vector3(w * 0.4, 0, 0);
    meshes.push(lineRight);

    var gunSight = BABYLON.Mesh.MergeMeshes(meshes);
    gunSight.name = "gunSight";
    gunSight.layerMask = 0x20000000;
    gunSight.freezeWorldMatrix();

    var mat = new BABYLON.StandardMaterial("emissive mat", scene);
    mat.checkReadyOnlyOnce = true;
    mat.emissiveColor = new BABYLON.Color3(0, 1, 0);

    gunSight.material = mat;
  }
}
export default PlayerGun;
