import * as BABYLON from "@babylonjs/core";

const canvas = document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);

const createScene = async () => {
	const scene = new BABYLON.Scene(engine);
	scene.createDefaultCameraOrLight(true, false, true);

	/* Regular shape meshs */
	// const sphere = new BABYLON.MeshBuilder.CreateSphere(
	// 	"aSphere",
	// 	{
	// 		segments: 1,
	// 		diameter: 0.1,
	// 	},
	// 	scene
	// );
	// const box = new BABYLON.MeshBuilder.CreateBox("aBox", {
	//   size: 0.1,
	//   width: 2,
	//   faceColors: [new BABYLON.Color4(1,0,0,1)]
	// }, scene);

	/* Ground meshs */
	// const groundHeightMap = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
	// 	"hMap",
	// "/public/assets/city_height_map.png",
	// {
	//   height: 10,
	//   width: 10,
	//   subdivisions: 500
	// }
	// );
	// groundHeightMap.material = new BABYLON.StandardMaterial();
	// groundHeightMap.material.wireframe = true;

	/* Text */
	const spellFont = await (await fetch("/public/assets/First_Order_Plain_Regular.json")).json();
	const sampleText = new BABYLON.MeshBuilder.CreateText(
		"aText",
		"Textual text",
		spellFont,
		{
			size: 2,
		}
	);

	return scene;
};

// const mainScene = createScene().then(() => {
// 	engine.runRenderLoop(() => {
// 		mainScene.render();
// 	});
// }, (err) => {
// 	console.log(err);
// })

var scene = createScene();
scene.then((scene)=>{
	engine.runRenderLoop(function () {
		if (scene) {
			scene.render();
		}
	});
})

window.addEventListener("resize", () => {
	engine.resize();
});
