import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  Vector3,
  Color3,
} from "@babylonjs/core";
import Player from "./scripts/Player";
import cannon from "cannon";
import GameEnvironment from "./scripts/gameEnvironment"
import PlayerCamera from "./scripts/playerCamera"

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
    scene.ambientColor = new Color3(1,1,1);
    scene.gravity = new Vector3(0, -.75, 0); 
    scene.collisionsEnabled = true;
    window.CANNON = cannon;
    scene.enablePhysics();

    var camera = new PlayerCamera(scene, canvas);
    const gameEnvironment = new GameEnvironment(scene);
    const player = new Player(scene, camera);

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

    var isLocked = false;

    scene.onPointerDown = function (evt) {
		
      //true/false check if we're locked, faster than checking pointerlock on each single click.
      if (!isLocked) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
        }
      }
      
      //continue with shooting requests or whatever :P
      //evt === 1 (mouse wheel click (not scrolling))
      //evt === 2 (right mouse click)
    };

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}
new App();
