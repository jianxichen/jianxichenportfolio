import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";

import * as SceneTracker from "../common/ActiveSceneTracker";
import * as ShipScene from "./ShipLoadingScene";
import * as SushiScene from "./SushiOrderScene";

const sceneTracker: SceneTracker.ActiveSceneTracker = new SceneTracker.ActiveSceneTracker();
const engine = sceneTracker.engine;

// Load ship loading scene first (perhaps we will need a pre-loading screen before this loading scene)
let shipScene: ShipScene.ShipLoading = new ShipScene.ShipLoading(sceneTracker);
shipScene.showLoadingAssets();

engine.runRenderLoop(() => {
	sceneTracker.scenes.get(sceneTracker.activeScene)!.render();
});

// let sushiScene = new SushiScene.SushiOrderScene(engine, scenes);
// sushiScene.showLoadingAssets();