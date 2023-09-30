import * as BABYLON from "@babylonjs/core";

class GameEnvironment {
    ground: any;
    constructor(scene) {
        
      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

      // Default intensity is 1. Let's dim the light a small amount
      light.intensity = 0.7;
  

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


        this.createGround(scene);
        this.createSphere(scene, this.createMaterial(scene));
    }

    private createMaterial(scene): BABYLON.Material {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        myMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        return myMaterial;
    }


    private createGround(scene): void {
        var myGround = BABYLON.MeshBuilder.CreateGround(
            "myGround",
            { width: 200, height: 200 },
            scene
        );
        myGround.position.y = -1;
        myGround.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        groundMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        groundMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.7, 0.6);
        myGround.material = groundMaterial;
        myGround.physicsImpostor = new BABYLON.PhysicsImpostor(
            myGround,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.9 },
            scene
        );
        this.ground = myGround;
    }

    private createSphere(scene, mat): void {
        var y = 200;
        for (var index = 0; index < 50; index++) {
            var sphere = BABYLON.Mesh.CreateSphere("Sphere0", 16, 3, scene);
            sphere.material = mat;
            sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1 }, scene);
            sphere.checkCollisions = true;
            y += 2;
        }

        sphere.checkCollisions = true;
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, restitution: 0.7 }, scene);
        sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(10, 10, 10), sphere.getAbsolutePosition());

    }
}
export default GameEnvironment;
