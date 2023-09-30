import * as BABYLON from "@babylonjs/core";

const red = new BABYLON.Color4(1, 0, 0);
const blue = new BABYLON.Color4(0, 0, 1);
const faceColors = [red, blue, blue, blue, blue, blue];

class Player extends BABYLON.Mesh {
  hitpoints: number;
  speed: number;
  isAlive: boolean;
  scene: BABYLON.Scene;
  constructor(scene: BABYLON.Scene, camera: BABYLON.UniversalCamera) {
    super("hero");
    this.scene = scene;

    BABYLON.Mesh.CreateBox("hero", 2.0, this.scene, false, BABYLON.Mesh.FRONTSIDE);

    this.position.x = 0.0;
    this.position.y = 1.0;
    this.position.z = -3.0;
    this.physicsImpostor = new BABYLON.PhysicsImpostor(
      this,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.0, friction: 0.1 },
      this.scene
    );

    // pointer
    var pointer = BABYLON.Mesh.CreateSphere(
      "Sphere",
      16.0,
      0.01,
      this.scene,
      false,
      BABYLON.Mesh.DOUBLESIDE
    );

    // move the sphere upward 1/2 of its height
    pointer.position.x = 0.0;
    pointer.position.y = 0.0;
    pointer.position.z = 0.0;
    pointer.isPickable = false;

    var moveForward = false;
    var moveBackward = false;
    var moveRight = false;
    var moveLeft = false;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.keyCode) {
          case 38: // up
          case 87: // w
              moveForward = true;
              break;
  
          case 37: // left
          case 65: // a
              moveLeft = true;
              break;
  
          case 40: // down
          case 83: // s
              moveBackward = true;
              break;
  
          case 39: // right
          case 68: // d
              moveRight = true;
              break;
  
          case 32: // space
              break;
      }
  };
  
  const onKeyUp = (event: KeyboardEvent) => {
      switch (event.keyCode) {
          case 38: // up
          case 87: // w
              moveForward = false;
              break;
  
          case 37: // left
          case 65: // a
              moveLeft = false;
              break;
  
          case 40: // down
          case 83: // s
              moveBackward = false;
              break;
  
          case 39: // right
          case 68: // d
              moveRight = false;
              break;
      }
  };
  
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);
  
  this.scene.registerBeforeRender(() => {
    camera.position.x = this.position.x;
    camera.position.y = this.position.y + 1.0;
    camera.position.z = this.position.z;
    pointer.position = camera.getTarget();

    const forward = camera.getTarget().subtract(camera.position).normalize();
    forward.y = 0;
    const right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();
    right.y = 0;

    const SPEED = 20;
    let f_speed = 0;
    let s_speed = 0;
    let u_speed = 0;

    if (moveForward) {
        f_speed = SPEED;
    }
    if (moveBackward) {
        f_speed = -SPEED;
    }

    if (moveRight) {
        s_speed = SPEED;
    }

    if (moveLeft) {
        s_speed = -SPEED;
    }

    const move = (forward.scale(f_speed)).subtract((right.scale(s_speed))).subtract(camera.upVector.scale(u_speed));

    this.physicsImpostor.physicsBody.velocity.x = move.x;
    this.physicsImpostor.physicsBody.velocity.z = move.z;
    this.physicsImpostor.physicsBody.velocity.y = move.y;
    });

    this.hitpoints = 100;
    this.isAlive = true;
    this.speed = 5;
  }

  private degToRad(deg): number {
    return (Math.PI * deg) / 180;
  }
}
export default Player;
