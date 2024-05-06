import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import "@babylonjs/core/Debug/debugLayer";


const canvas = <HTMLCanvasElement> document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);

// Loading screen

function CustomLoadingScreen( /* variables needed, for example:*/ text) {
    //init the loader
    this.loadingUIText = text;
  }
  CustomLoadingScreen.prototype.displayLoadingUI = function() {
    alert(this.loadingUIText);
  };
  CustomLoadingScreen.prototype.hideLoadingUI = function() {
    alert("Loaded!");
  };

engine.displayLoadingUI();

const createScene = async () => {
	const scene = new BABYLON.Scene(engine);
	scene.createDefaultCameraOrLight(true, false, true);
    engine.hideLoadingUI();
	return scene;
};

const mainScene = await createScene();

engine.runRenderLoop(() => {
	mainScene.render();
});
