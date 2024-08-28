import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

import * as SceneTracker from "../common/ActiveSceneTracker";
import {
	IScene,
	chunkOutTransformNodesNotMeshes,
} from "../common/SceneInterface";

export class ShipLoading implements IScene {
	private _scene: BABYLON.Scene;

	constructor(activeScene: SceneTracker.ActiveSceneTracker) {
		this.scene = activeScene.createScene();
		activeScene.addScene(SceneTracker.ActiveSceneEnum.LOADING, this.scene);
		this.scene.debugLayer.show({
			embedMode: true,
		});
	}

	showLoadingAssets() {
		this.setupCamera();
		this.setupLight();
		this.setupMeshes();
		this.setupWaves();
		this.setupText();
		this.setupBackground();
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
		arcCam.attachControl();
	}

	private setupLight() {
		const directionalLight = new BABYLON.DirectionalLight(
			"directionalLight",
			new BABYLON.Vector3(-5, -5, 5), // light ray = origin to cordinate
			this.scene
		);
		directionalLight.intensity = 1;

		const directionalLight2 = new BABYLON.DirectionalLight(
			"directionalLight2ForText",
			new BABYLON.Vector3(-5, 0, 0), // light ray = origin to cordinate
			this.scene
		);
		directionalLight2.intensity = 1;
	}

	private setupMeshes() {
		// Boat
		BABYLON.SceneLoader.ImportMesh(
			null, // null or "" imports all mesh, else looks for specific
			"/public/assets/models/ships/",
			"Boat.obj",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const boat = meshes[0];
				boat.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
				boat.rotation.x = -Math.PI / 100;

				const boatOffsetY = 0;
				this.scene.registerBeforeRender(() => {
					// Bobble up down
					boat.position.y =
						Math.sin(Date.now() / 1000) / 20 + boatOffsetY;
					// Sways front and back
					boat.rotation.x = -Math.sin(Date.now() / 1000) / 20;
				});

				const loadTxtLight = this.scene.getLightByName(
					"directionalLight2ForText"
				)!;
				meshes.forEach((mesh) => {
					loadTxtLight.excludedMeshes.push(mesh);
				});
			}
		);

		// Shiba
		BABYLON.SceneLoader.ImportMesh(
			"RootNode", // null or "" imports all mesh, else looks for specific
			"/public/assets/models/shiba/",
			"scene.gltf",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const dogRoot = meshes[0];

				// Unlink meshes from the TransformNode from glTF and remove TransformNodes
				chunkOutTransformNodesNotMeshes(meshes);
				dogRoot.getChildMeshes(false).forEach((dogMesh) => {
					dogMesh.setParent(dogRoot);
				});

				dogRoot.name = "shiba" + dogRoot.name;
				const dogScaling = 0.3;
				dogRoot.scaling = new BABYLON.Vector3(
					dogScaling,
					dogScaling,
					dogScaling
				);
				dogRoot.position.z = -0.25;
				// dogMesh.rotation.y = 20;

				const dogOffsetY = 0.4;
				this.scene.registerBeforeRender(() => {
					// Bobble up down
					dogRoot.position.y =
						Math.sin(Date.now() / 1000) / 20 + dogOffsetY;
				});

				const loadTxtLight = this.scene.getLightByName(
					"directionalLight2ForText"
				)!;
				loadTxtLight.excludedMeshes.push(dogRoot);
			}
		);

		// Clouds
		BABYLON.SceneLoader.ImportMesh(
			"Cloud_1", // null or "" imports all mesh, else looks for specific
			"/public/assets/models/lotsofanimals/",
			"scene.gltf",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const cloudRoot = meshes[0];
				cloudRoot.rotation = BABYLON.Vector3.Zero();
				cloudRoot.position = BABYLON.Vector3.Zero();
				cloudRoot.name = "cloud" + cloudRoot.name;
				// Unlink meshes from the TransformNode from glTF and remove TransformNodes
				chunkOutTransformNodesNotMeshes(meshes);
				cloudRoot.getChildMeshes(false).forEach((cloudMesh) => {
					cloudMesh.setParent(cloudRoot);
					cloudMesh.position = new BABYLON.Vector3(0, 0, 0);
					cloudMesh.rotation = new BABYLON.Vector3(0, 0, 0);
				});
				for (let index = 0; index < 3; index++) {
					cloudRoot.addChild(meshes[1].clone(`cloudClone${index}`, cloudRoot)!, true);
				}

				const cloudScaling = .25;
				cloudRoot.scaling = new BABYLON.Vector3(
					cloudScaling,
					cloudScaling,
					cloudScaling
				);
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

		const loadTxtLight = this.scene.getLightByName(
			"directionalLight2ForText"
		)!;
		// loadTxtLight.excludeWithLayerMask = wavesSpriteManager.layerMask;
	}

	private async setupText() {
		const font = await (
			await fetch("/public/assets/To_Japan_Regular.json")
		).json();
		const loadingText = BABYLON.MeshBuilder.CreateText(
			"loadingTxt",
			"Loading",
			font,
			{
				size: 0.25,
				depth: 0.000001,
				resolution: 100,
				faceColors: [
					new BABYLON.Color4(1, 1, 1, 1),
					new BABYLON.Color4(1, 1, 1, 1),
					new BABYLON.Color4(1, 1, 1, 1),
				],
			},
			this.scene
		)!;
		loadingText.rotation.y = -Math.PI / 2;
		loadingText.position = new BABYLON.Vector3(0, 0.25, 0);

		// Make the periods dynamic
		this.scene.registerBeforeRender(() => {
			// loadingText.dispose()
			// this.scene.addmes
		});
	}

	private setupBackground() {
		var backgroundBox = BABYLON.Mesh.CreateBox(
			"BackgroundSkybox",
			500,
			this.scene,
			undefined,
			BABYLON.Mesh.BACKSIDE
		);

		var backgroundMaterial = new BABYLON.BackgroundMaterial(
			"backgroundMaterial",
			this.scene
		);
		backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture(
			"/public/assets/",
			this.scene
		);
		backgroundMaterial.reflectionTexture.coordinatesMode =
			BABYLON.Texture.SKYBOX_MODE;
		backgroundBox.material = backgroundMaterial;
	}

	public get scene(): BABYLON.Scene {
		return this._scene;
	}

	public set scene(value: BABYLON.Scene) {
		this._scene = value;
	}
}
