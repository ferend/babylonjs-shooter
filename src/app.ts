import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, Vector3, Color3 } from "@babylonjs/core";
import Player from "./scripts/Player";
import cannon from "cannon";
import GameEnvironment from "./scripts/gameEnvironment";
import PlayerCamera from "./scripts/playerCamera";
import PlayerGun from "./scripts/playerGun";

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    var canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.id = "gameCanvas";
    document.body.appendChild(canvas);

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);

    var scene = new Scene(engine);
    window.CANNON = cannon;
    scene.enablePhysics(new Vector3(0, -9.81, 0)); // You can adjust the gravity value as needed
    scene.ambientColor = new Color3(1, 1, 1);
    scene.collisionsEnabled = true;

    var camera = new PlayerCamera(scene, canvas);
    new GameEnvironment(scene);
    const player = new Player(scene, camera);
    const playerGun = new PlayerGun(scene);
    
    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    let isLocked: boolean = false;

    scene.onPointerDown = (evt: PointerEvent) => {
      if (!isLocked) {
        const canvas = scene.getEngine().getRenderingCanvas();
        const requestPointerLock =
          canvas.requestPointerLock ||
          canvas.msRequestPointerLock ||
          canvas.mozRequestPointerLock ||
          canvas.webkitRequestPointerLock;
    
        if (requestPointerLock) {
          requestPointerLock.call(canvas);
        }
      }
      else {
        playerGun.calculateShoot(scene,camera,player.playerWrapper,player.characterHeight);
      }
    };
    
    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    const pointerlockchange = () => {
      const controlEnabled =
        document.pointerLockElement ||
        null;
    
      // If the user is already locked
      if (!controlEnabled) {
        // camera.detachControl(canvas);
        isLocked = false;
      } else {
        // camera.attachControl(canvas);
        isLocked = true;
      }
    };
    
    
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    player.listenEvents(canvas);

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}
new App();
