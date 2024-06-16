import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import * as SceneTracker from "../common/ActiveSceneTracker"
import { IScene } from "../common/SceneInterface"

export class ShipLoading implements IScene{
	private _scene: BABYLON.Scene;

	constructor(activeScene: SceneTracker.ActiveSceneTracker) {
		this.scene = activeScene.createScene();
		activeScene.addScene(SceneTracker.ActiveSceneEnum.LOADING, this.scene);
	}
	
	showLoadingAssets() {
		this.scene.createDefaultCameraOrLight(true, false, true);
		const sphere = BABYLON.MeshBuilder.CreateSphere(
			"aSphere",
			{
				segments: 10,
				diameter: 1,
			},
			this.scene
		);
		sphere.position = new BABYLON.Vector3(0, 0, 0);
		const sphereMat = new BABYLON.StandardMaterial("sphereMat");
		sphereMat.diffuseColor = new BABYLON.Color3(0, 1, 0); // sets color of object in light
		sphereMat.specularColor = new BABYLON.Color3(1, 0, 1); // sets color of light spot
		sphereMat.ambientColor = new BABYLON.Color3(1, 1, 0); // sets max possible ambient color
		this.scene.ambientColor = new BABYLON.Color3(1, 0, 0); // sets ambience color in scene
		sphereMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // sets color of object w/o light
		sphereMat.alpha = 1; // opacity
		sphereMat.diffuseTexture = new BABYLON.Texture(
			"/public/assets/wood.jpg"
		); // texture req. light
		sphereMat.emissiveTexture = new BABYLON.Texture(
			"/public/assets/wood.jpg"
		); // no req. light
		sphere.material = sphereMat;
	}

	hideLoadingAssets() {
		// changes active scene to content
		async () => {
			this.scene.dispose();
		};
	}

	public get scene(): BABYLON.Scene {
		return this._scene;
	}
	public set scene(value: BABYLON.Scene) {
		this._scene = value;
	}
}
