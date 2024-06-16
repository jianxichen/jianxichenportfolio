import * as BABYLON from "@babylonjs/core";
/**
 * All possible scene types
 */
export enum ActiveSceneEnum {
	LOADING,
	MAIN,
}

export class ActiveSceneTracker {
	private _activeScene: ActiveSceneEnum;
	private _canvas: HTMLCanvasElement;
	private _engine: BABYLON.Engine;
	private _scenes: Map<ActiveSceneEnum, BABYLON.Scene>;

	constructor() {
		this._activeScene = ActiveSceneEnum.LOADING;
		this._canvas = <HTMLCanvasElement>document.getElementById("main-scene");
		this._engine = new BABYLON.Engine(this.canvas);
		this._scenes = new Map();

		window.addEventListener("resize", () => {
			this._engine.resize();
		});
	}

	createScene() {
		return new BABYLON.Scene(this.engine);
	}

	addScene(sceneEnum: ActiveSceneEnum, newScene: BABYLON.Scene) {
		this.scenes.set(sceneEnum, newScene);
	}

	public get activeScene(): ActiveSceneEnum {
		return this._activeScene;
	}
	public set activeScene(value: ActiveSceneEnum) {
		this._activeScene = value;
	}
	public get canvas(): HTMLCanvasElement {
		return this._canvas;
	}
	public set canvas(value: HTMLCanvasElement) {
		this._canvas = value;
	}
	public get engine(): BABYLON.Engine {
		return this._engine;
	}
	public set engine(value: BABYLON.Engine) {
		this._engine = value;
	}
	public get scenes(): Map<ActiveSceneEnum, BABYLON.Scene> {
		return this._scenes;
	}
	public set scenes(value: Map<ActiveSceneEnum, BABYLON.Scene>) {
		if (this._scenes != null) {
			throw new Error("Scene mapping instance already exists");
		} else {
			this._scenes = value;
		}
	}
}
