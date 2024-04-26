import * as BABYLON from "@babylonjs/core";

const canvas = document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.createDefaultCameraOrLight(true, false, true);

  const sphere = new BABYLON.MeshBuilder.CreateSphere(
    "aSphere",
    {
      segments: 1,
      diameter: 0.1,
    },
    scene
  );

  // const box = new BABYLON.MeshBuilder.CreateBox("aBox", {
  //   size: 0.1,
  //   width: 2,
  //   faceColors: [new BABYLON.Color4(1,0,0,1)]
  // }, scene);

  return scene;
};

const mainScene = createScene();
engine.runRenderLoop(function () {
  mainScene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
