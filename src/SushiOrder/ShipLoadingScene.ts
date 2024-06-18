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
		this.setupCamera();
		this.setupLight();
		this.setupBoat();
		this.setupWaves();
		this.setupText();
	}

	hideLoadingAssets() {
		// TODO not done
		// changes active scene to content
		async () => {
			this.scene.dispose();
		};
	}

	private setupCamera() {
		let alpha = 0,
			beta = (Math.PI * 9) / 20,
			radius = 3;
		const arcCam = new BABYLON.ArcRotateCamera(
			"armCamera",
			alpha, // rotation around y-axis
			beta, // updown angle x-z plane
			radius, // initial distance from given cords
			new BABYLON.Vector3(0, 0, 0), // target cords for camera to face
			this.scene
		);
		return arcCam;
	}

	private setupLight() {
		const directionalLight = new BABYLON.DirectionalLight(
			"directionalLight",
			new BABYLON.Vector3(-5, -5, 5), // light ray = origin to cordinate
			this.scene
		);
		directionalLight.intensity = 1;
		return directionalLight;
	}

	private setupBoat() {
		BABYLON.SceneLoader.ImportMesh(
			null, // null or "" imports all mesh, else looks for specific
			"/public/assets/models/ships/",
			"Boat.obj",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const boat = meshes[0];
				// TODO need to add animation keyframes
				boat.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
				boat.rotation.x = -Math.PI / 100;

				this.scene.registerBeforeRender(() => {
					// Bobble boat up down
					boat.position.y = Math.sin(Date.now() / 1000) / 20 + 1 / 20;
					// Boat sways front and back
					boat.rotation.x = -Math.sin(Date.now() / 1000) / 20;
				});
			}
		);
	}

	private setupWaves() {
		const wavesSpriteManager = new BABYLON.SpriteManager(
			"wavesSpriteManager",
			"/public/assets/waves.png",
			1,
			{ width: 640, height: 320 },
			this.scene
		);
		const waveSprite = new BABYLON.Sprite("waves", wavesSpriteManager);
		waveSprite.size = 1;
		waveSprite.position = new BABYLON.Vector3(0.5, 0, 0);

		this.scene.registerBeforeRender(() => {
			waveSprite.position.y = Math.sin(Date.now() / 1000) / 40;
			waveSprite.angle = Math.sin(Date.now() / 1000) / 40;
		});
	}

	private async setupText() {
		const font = await (
			await fetch("/public/assets/To_Japan_Regular.json")
		).json();
		const loadingText = BABYLON.MeshBuilder.CreateText(
			"loading",
			"Loading \n *in development",
			font,
			{
				size: 0.25,
				depth: 0.000001,
				resolution: 100,
			},
			this.scene
		)!;
		loadingText.rotation.y = -Math.PI / 2;
		loadingText.position = new BABYLON.Vector3(0, 0.25, 0);

		// Make the periods dynamic
		this.scene.registerBeforeRender(() => {
			// loadingText.
		});
	}

	public get scene(): BABYLON.Scene {
		return this._scene;
	}

	public set scene(value: BABYLON.Scene) {
		this._scene = value;
	}
}
