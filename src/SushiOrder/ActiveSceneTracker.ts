import * as BABYLON from "@babylonjs/core";

enum ActiveSceneEnum {
	LOADING,
	MAIN,
}

export class ActiveSceneTracker {
	private activeScene: ActiveSceneEnum;
	private canvas: HTMLCanvasElement;
	private engine: BABYLON.Engine;
	private scenes: BABYLON.Scene[];

	constructor() {
		this.activeScene = ActiveSceneEnum.LOADING;
		this.canvas = <HTMLCanvasElement>document.getElementById("main-scene");
		this.engine = new BABYLON.Engine(this.canvas);
		this.scenes = [];
	}

	createScene() {
		return new BABYLON.Scene(this.engine);
	}

	setActiveScene(number) {
		this.activeScene = 1;
	}
}
