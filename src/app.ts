import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import * as GUI from "@babylonjs/gui";
import { Engine, Scene, Vector3, Color3 } from "@babylonjs/core";
import Player from "./scripts/Player";
import cannon from "cannon";
import GameEnvironment from "./scripts/gameEnvironment";
import PlayerCamera from "./scripts/playerCamera";
import PlayerGun from "./scripts/playerGun";

class App {

  private gameTime = 6;
  private isGameOver = false;
  private scoreText: GUI.TextBlock;
  private gameInfoText: GUI.TextBlock;
  private countdownText: GUI.TextBlock;

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

    this.scoreText = this.createScoreText();
    this.gameInfoText = this.createGameInfoText();
    
    let countdown = this.gameTime; 
    this.countdownText = this.createCountdownText(countdown);

   this.gameTimer(countdown,this.countdownText); 

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

    scene.onPointerDown = () => {
      if(this.isGameOver) return;

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
      } else {
        playerGun.calculateShoot(
          scene,
          camera,
          player.playerWrapper,
          player.characterHeight,
          () => player.updatePlayerScore(this.scoreText)
        );
      }
    };

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    const pointerlockchange = () => {
      const controlEnabled = document.pointerLockElement || null;

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
    document.addEventListener(
      "webkitpointerlockchange",
      pointerlockchange,
      false
    );
    player.listenEvents(canvas);

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

  }

  private gameTimer(countdown, countdownText) {
    
    const interval = setInterval(() => {
      countdown--; // Decrement the timer
      countdownText.text = `Time Left: ${countdown}`;
  
      if (countdown <= 0) {
        clearInterval(interval);
        console.log("Game Over");
        this.isGameOver = true;
        this.gameInfoText.text = "Game Over"
      }
    }, 1000);
  
    return interval;
  }

  private createScoreText(): GUI.TextBlock {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const scoreText = new GUI.TextBlock();
    scoreText.text = "Score: 0"; // Initial score
    scoreText.color = "red";
    scoreText.fontSize = 36;
    scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT ;
    scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.left = -200;
    scoreText.top = - 40;
    advancedTexture.addControl(scoreText);

    return scoreText;
  }

  private createGameInfoText(): GUI.TextBlock {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const scoreText = new GUI.TextBlock();
    scoreText.text = "Score points before time runs out"; // Initial score
    scoreText.color = "red";
    scoreText.fontSize = 32;
    scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT ;
    scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.top = + 100;
    advancedTexture.addControl(scoreText);

    return scoreText;
  }

  private createCountdownText(initialValue) {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const countdownText = new GUI.TextBlock();
    countdownText.text = `Time Left: ${initialValue}`;
    countdownText.color = "red";
    countdownText.fontSize = 36;
    countdownText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    countdownText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    countdownText.left = +200;
    countdownText.top = -40;
    advancedTexture.addControl(countdownText);

    return countdownText;
  }
}
new App();
