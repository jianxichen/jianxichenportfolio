import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import * as SceneTracker from "../common/ActiveSceneTracker";
import { IScene } from "../common/SceneInterface";

export class ShipLoading implements IScene {
	private _scene: BABYLON.Scene;

	constructor(activeScene: SceneTracker.ActiveSceneTracker) {
		this.scene = activeScene.createScene();
		activeScene.addScene(SceneTracker.ActiveSceneEnum.LOADING, this.scene);
	}

	showLoadingAssets() {
		this.setUpCamera();
		this.setUpLight();
		this.setUpBoat();
	}

	hideLoadingAssets() {
		// changes active scene to content
		async () => {
			this.scene.dispose();
		};
	}

	private setUpCamera() {
		let alpha = 0,
			beta = (Math.PI * 9) / 20,
			radius = 3;
		const arcCam = new BABYLON.ArcRotateCamera(
			"armCamera",
			alpha, // rotation around y-axis
			beta, // angle from y-axis
			radius, // initial distance from given cords
			new BABYLON.Vector3(0, 0, 0), // target cords for camera to face
			this.scene
		);
		arcCam.attachControl(false);
		// arcCam.setPosition(new BABYLON.Vector3(0,0,-50)); // overrides alpha, beta, radi
		// Y-axis (left-right) rotate restrictions
		// arcCam.upperAlphaLimit = Math.PI / 2;
		// arcCam.lowerAlphaLimit = (-Math.PI * 3) / 2;
		// X/Z-axis (up-down) rotate restrictions
		// arcCam.upperBetaLimit = Math.PI;
		// arcCam.lowerBetaLimit = 0;
		// Zooming restrictions
		arcCam.lowerRadiusLimit = 3;
		arcCam.upperRadiusLimit = 3;

		return arcCam;
	}

	private setUpLight() {
		const directionalLight = new BABYLON.DirectionalLight(
			"directionalLight",
			new BABYLON.Vector3(-5, -5, 5), // light ray = origin to cordinate
			this.scene
		);
		directionalLight.intensity = 1;
		return directionalLight;
	}

	private setUpBoat() {
		BABYLON.SceneLoader.ImportMesh(
			null, // null or "" imports all mesh, else looks for specific
			"/public/assets/models/ships/",
			"Boat.obj",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const boat = meshes[0];
				// TODO need to add animation keyframes
			}
		);
	}

	public get scene(): BABYLON.Scene {
		return this._scene;
	}
	public set scene(value: BABYLON.Scene) {
		this._scene = value;
	}
}
