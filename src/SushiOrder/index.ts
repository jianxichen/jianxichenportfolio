import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";

import * as SceneTracker from "../common/ActiveSceneTracker";
import * as ShipScene from "./ShipLoadingScene";
import * as SushiScene from "./SushiOrderScene";

const canvas = <HTMLCanvasElement>document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);
const sceneTracker: SceneTracker.ActiveSceneTracker = new SceneTracker.ActiveSceneTracker();

let shipScene: ShipScene.ShipLoading = new ShipScene.ShipLoading(sceneTracker);
shipScene.showLoadingAssets();

engine.runRenderLoop(() => {
	sceneTracker.scenes.get(sceneTracker.activeScene)!.render();
});

// let sushiScene = new SushiScene.SushiOrderScene(engine, scenes);
// sushiScene.showLoadingAssets();
