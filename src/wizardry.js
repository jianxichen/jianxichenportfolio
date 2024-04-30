import * as BABYLON from "@babylonjs/core";

const canvas = document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);

const createScene = async () => {
	const scene = new BABYLON.Scene(engine);

	// scene.createDefaultCameraOrLight(true, false, true);

	/* Lights */
	// https://youtu.be/e6EkrLr8g_o?t=2103

	/* Cameras */
	// First person POV camera
	// scene.createDefaultLight();
	// const firstPOV = new BABYLON.UniversalCamera(
	// 	"firstPOV",
	// 	new BABYLON.Vector3(0, 5, -10),
	// 	scene
	// );
	// firstPOV.attachControl(true);
	// firstPOV.inputs.addMouseWheel();
	// firstPOV.setTarget(new BABYLON.Vector3(0, 3, 0)); // sets camera view to cords
	// Arc camera: camera that circles around cords
	let alpha = -Math.PI / 2,
		beta = Math.PI / 3,
		radius = 10;
	const arcCam = new BABYLON.ArcRotateCamera(
		"armCamera",
		alpha, // initial rotation around y-axis
		beta, // initial rotation around z-axis
		radius, // initial distance from given cords
		BABYLON.Vector3.Zero(), // target cords for camera to face
		scene
	);
	arcCam.attachControl(true);
	// arcCam.setPosition(new BABYLON.Vector3(0,0,-50)); // overrides alpha, beta, radi
	// Y-axis (left-right) rotate restrictions
	arcCam.upperAlphaLimit = Math.PI / 2;
	arcCam.lowerAlphaLimit = (-Math.PI * 3) / 2;
	// X-axis (up-down) rotate restrictions
	arcCam.upperBetaLimit = Math.PI;
	arcCam.lowerBetaLimit = 0;
	// Zooming restrictions
	arcCam.lowerRadiusLimit = 5;
	arcCam.upperRadiusLimit = 20;

	/* Regular shape meshs */
	// const sphere = new BABYLON.MeshBuilder.CreateSphere(
	// 	"aSphere",
	// 	{
	// 		segments: 10,
	// 		diameter: 5,
	// 	},
	// 	scene
	// );
	// const sphereMat = new BABYLON.StandardMaterial();
	// sphereMat.diffuseColor = new BABYLON.Color3(0, 1, 0); // sets color of object in light
	// sphereMat.specularColor = new BABYLON.Color3(1, 0, 1); // sets color of light spot
	// sphereMat.ambientColor = new BABYLON.Color3(1, 1, 0); // sets max possible ambient color
	// scene.ambientColor = new BABYLON.Color3(1, 0, 0); // sets ambience color in scene
	// sphereMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // sets color of object w/o light
	// sphereMat.alpha = 0.5; // opacity
	// sphereMat.diffuseTexture = new BABYLON.Texture("/public/assets/wood.jpg"); // texture req. light
	// sphereMat.emissiveTextureTexture = new BABYLON.Texture("/public/assets/wood.jpg"); // no req. light
	// sphere.material = sphereMat;\

	const box = new BABYLON.MeshBuilder.CreateBox(
		"aBox",
		{
			size: 5,
			// faceColors: [new BABYLON.Color4(1, 0, 0, 1)],
			faceUV: [
				new BABYLON.Vector4(0, 0, 1 / 2, 1 / 2),
				new BABYLON.Vector4(0, 1 / 2, 1 / 2, 1),
			],
			wrap: true,
		},
		scene
	);
	const boxMat = new BABYLON.StandardMaterial();
	boxMat.emissiveTexture = new BABYLON.Texture("/public/assets/wood.jpg");
	box.material = boxMat;
	box.position = new BABYLON.Vector3(5, 0, 0);
	box.rotation = new BABYLON.Vector3(Math.PI / 3, 0, Math.PI / 4);
	box.scaling = new BABYLON.Vector3(1, 1, 1);

	/* Debugging tools */
	const utilityLayer = new BABYLON.UtilityLayerRenderer(scene);
	const positionGizmo = new BABYLON.PositionGizmo(utilityLayer);
	// Adds XYZ position, scaling, and rotation axes to box
	positionGizmo.attachedMesh = box;
	const scaleGizmo = new BABYLON.ScaleGizmo(utilityLayer);
	scaleGizmo.attachedMesh = box;
	const rotateGizmo = new BABYLON.RotationGizmo(utilityLayer);
	rotateGizmo.attachedMesh = box; // Doesn't work if non-uniform scaling
	// const planeGizmo = new BABYLON.PlaneRotationGizmo(
	// 	new BABYLON.Vector3(0, 0, 1),
	// 	new BABYLON.Color3(1, 0, 0),
	// 	utilityLayer
	// );
	// planeGizmo.attachedMesh = box; // Rotates on only 1 plane

	/* Ground meshs */
	// const groundHeightMap = new BABYLON.MeshBuilder.CreateGroundFromHeightMap(
	// 	"hMap",
	// 	"/public/assets/city_height_map.png",
	// 	{
	// 		height: 10,
	// 		width: 10,
	// 		subdivisions: 1000,
	// 	}
	// );
	// const grndHgtMat = new BABYLON.StandardMaterial();
	// grndHgtMat.emissiveTexture = new BABYLON.Texture("/public/assets/wood.jpg");
	// grndHgtMat.emissiveTexture.uOffset = .5; // horizontal texture offset
	// grndHgtMat.emissiveTexture.vOffset = .5; // vertical texture offset
	// grndHgtMat.emissiveTexture.uScale = 1; // horizontal scale texture
	// grndHgtMat.emissiveTexture.vScale = 1; // vertical scale texture
	// groundHeightMap.material = grndHgtMat;
	// groundHeightMap.material.wireframe = true;

	/* Text */
	// const spellFont = await (
	// 	await fetch("/public/assets/First_Order_Plain_Regular.json")
	// ).json();
	// const sampleText = new BABYLON.MeshBuilder.CreateText(
	// 	"aText",
	// 	"Textual text",
	// 	spellFont,
	// 	{
	// 		size: 2,
	// 		depth: 0.1,
	// 		resolution: 100,
	// 	}
	// );

	/* Animation */
	// (1) Callback method before every scene.render() from engine.runRenderLoop()
	// scene.registerBeforeRender(() => {
	// 	box.rotation.x += .01;
	// 	box.rotation.y += .01;
	// 	box.rotation.z += .01;
	// });
	// (2) Call the Babylon Animation's creation function
	// BABYLON.Animation.CreateAndStartAnimation(
	// 	"rotatingBox",
	// 	box,
	// 	"rotation.x",
	// 	15,
	// 	60,
	// 	0,
	// 	20,
	// 	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
	// );
	// (3) Create Animation object with animation keyframe sequences
	const animation = new BABYLON.Animation(
		"yRotation",
		"rotation.y",
		15,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
	);
	const animationKeyFrames = [
		{
			frame: 0,
			value: 0,
		},
		{
			frame: 480,
			value: 3 * Math.PI,
		},
	];
	animation.setKeys(animationKeyFrames);
	box.animations = [animation];
	scene.beginAnimation(box, 0, 60, false);

	return scene;
};

var mainScene = createScene();
mainScene.then(
	(scene) => {
		engine.runRenderLoop(function () {
			if (scene) {
				scene.render();
			}
		});
	},
	(err) => {
		console.log(err);
	}
);

window.addEventListener("resize", () => {
	engine.resize();
});
