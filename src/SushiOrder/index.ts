import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import "@babylonjs/core/Debug/debugLayer";
import * as SceneTracker from "./ActiveSceneTracker";
import * as ShipScene from "./ShipLoadingScene";
import * as SushiScene from "./SushiOrderScene";

const canvas = <HTMLCanvasElement>document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);
const scenes: BABYLON.Scene[] = [];
const scneTrack: SceneTracker.ActiveSceneTracker =
	new SceneTracker.ActiveSceneTracker();

let shipScene: ShipScene.ShipLoading = new ShipScene.ShipLoading(scneTrack);
shipScene.showLoadingAssets();

engine.runRenderLoop(() => {
	scenes[scneTrack.activeScene].render();
});

let sushiScene = new SushiScene.SushiOrderScene(engine, scenes);
sushiScene.showLoadingAssets();
