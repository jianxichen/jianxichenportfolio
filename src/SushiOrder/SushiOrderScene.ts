import * as BABYLON from "@babylonjs/core";

export class SushiOrderScene {
	scene: BABYLON.Scene;
	constructor(
		private engine: BABYLON.Engine,
		private scenes: BABYLON.Scene[],
	) {
		const scene = new BABYLON.Scene(engine);
		this.scene = scene;
		scenes[CONSTANTS.ActiveSceneEnum.MAIN] = scene;
	}
	async showLoadingAssets() {
        this.scene.createDefaultCameraOrLight(true, false, true);
		BABYLON.SceneLoader.ImportMesh(
			null, // null or "" imports all mesh, else looks for specific
			"/public/assets/models/",
			"Cow.gltf",
			this.scene,
			(meshes, particleSystems, skeletons, animationGroups) => {
				const cow = meshes[0];
				cow.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
				animationGroups[2].play(true);
			}
		);
	};

	hideLoadingAssets() {
		// changes active scene to content
        (async () => {
            this.scene.dispose();
        });
	};
}
