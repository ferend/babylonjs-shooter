import * as BABYLON from "@babylonjs/core";
const red = new BABYLON.Color4(1, 0, 0);
const blue = new BABYLON.Color4(0, 0, 1);
const faceColors = [red, blue, blue, blue, blue, blue];

class Player extends BABYLON.Mesh {
  private playerMesh: BABYLON.Mesh;
  public characterHeight = 1.8;
  public playerWrapper: BABYLON.AbstractMesh;
  private movingForward = false;
  private movingBack = false;
  private movingLeft = false;
  private movingRight = false;
  private isRunning = false;
  private isJumping = false;
  private canJump = true;
  private movementEnabled: true;
  private scene: BABYLON.Scene;
  private camera: BABYLON.FreeCamera;
  private walkSpeed = 10;
  private runSpeed = 15;

  constructor(scene: BABYLON.Scene, camera: BABYLON.FreeCamera) {
    super("hero");
    this.playerMesh = new BABYLON.Mesh("player");
    this.scene = scene;
    this.camera = camera;
    this.camera.position.y = this.characterHeight;
    this.playerWrapper = BABYLON.CreateSphere("player-wrapper", {
      diameter: 1,
      diameterY: this.characterHeight,
    });
    this.playerWrapper.position = new BABYLON.Vector3(
      0,
      this.characterHeight / 2,
      -10
    );

    this.playerWrapper.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.playerWrapper,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 80,
        friction: 0,
      }
    );

    this.playerWrapper.physicsImpostor.physicsBody.angularDamping = 1;
    this.camera.parent = this.playerWrapper;
    this.playerMesh.setParent(this.playerWrapper);
    this.playerMesh.position = new BABYLON.Vector3(
      this.playerMesh.position.x,
      this.characterHeight / 2,
      0
    );
    this.playerMesh.isVisible = false;
    this.playerWrapper.isVisible = false;
    this.calculateMovement();
  }

  private calculateMovement() {
    let once = false;

    this.scene.registerBeforeRender(() => {
      const cameraDirection = this.camera.getDirection(
        BABYLON.Vector3.Forward()
      );
      const currentSpeed = this.isRunning ? this.runSpeed : this.walkSpeed;

      const currentVelocity =
        this.playerWrapper.physicsImpostor.getLinearVelocity();

      if (
        (currentVelocity.x !== 0 || currentVelocity.z !== 0) &&
        // !this._sounds.step.isPlaying &&
        this.checkIsGrounded()
      ) {
        // this._sounds.step.play();
      }

      let velocity = new BABYLON.Vector3(0, 0, 0);

      if (this.movingForward) {
        velocity = cameraDirection.scale(currentSpeed);
      }

      if (this.movingBack) {
        velocity = cameraDirection.scale(-currentSpeed * 0.6);
      }

      if (this.movingLeft) {
        velocity = cameraDirection.cross(BABYLON.Axis.Y).scale(currentSpeed);
      }

      if (this.movingRight) {
        velocity = cameraDirection.cross(BABYLON.Axis.Y).scale(-currentSpeed);
      }

      if (this.isJumping) {
        this.canJump = this.checkIsGrounded();
        if (this.canJump) {
          currentVelocity.y = 10;
        }
      }

      velocity.y = currentVelocity.y;

      this.playerWrapper.physicsImpostor.setLinearVelocity(velocity);
    });
  }

  public listenEvents(canvas) {
    canvas = this._scene.getEngine().getRenderingCanvas();
    this.onKeyDown(canvas);
    this.onKeyUp(canvas);
  }

  private onKeyDown(canvas: HTMLCanvasElement) {
    canvas.addEventListener(
      "keydown",
      (event) => {
        switch (event.code) {
          case "KeyW":
            this.movingForward = true;
            break;
          case "KeyS":
            this.movingBack = true;
            break;
          case "KeyA":
            this.movingLeft = true;
            break;
          case "KeyD":
            this.movingRight = true;
            break;
          case "ShiftLeft":
            this.isRunning = true;
            break;
          case "Space":
            this.isJumping = true;
            break;
        }
      },
      false
    );
  }

  private onKeyUp(canvas: HTMLCanvasElement) {
    canvas.addEventListener(
      "keyup",
      (event) => {
        switch (event.code) {
          case "KeyW":
            this.movingForward = false;
            break;
          case "KeyS":
            this.movingBack = false;
            break;
          case "KeyA":
            this.movingLeft = false;
            break;
          case "KeyD":
            this.movingRight = false;
            break;
          case "ShiftLeft":
            this.isRunning = false;
          case "Space":
            this.isJumping = false;
            break;
        }
      },
      false
    );
  }

  private checkIsGrounded(): boolean {
    const ray = new BABYLON.Ray(
      this.playerWrapper.getAbsolutePosition(),
      BABYLON.Vector3.Down(),
      1
    );
    const pickingInfo = this._scene.pickWithRay(ray);

    return Boolean(pickingInfo.pickedMesh);
  }

  public jump(): void {
    if (this.checkIsGrounded() === false) return;
    this.physicsImpostor.applyImpulse(
      new BABYLON.Vector3(1, 20, -1),
      this.getAbsolutePosition()
    );
  }

  private degToRad(deg): number {
    return (Math.PI * deg) / 180;
  }
}
export default Player;
