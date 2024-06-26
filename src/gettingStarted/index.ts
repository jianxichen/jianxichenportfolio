import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

const canvas = <HTMLCanvasElement>document.getElementById("main-scene");
const engine = new BABYLON.Engine(canvas);

/* Loading screen */
function CustomLoadingScreen(/* variables needed, for example:*/ text) {
	//init the loader
	this.loadingUIText = text;
}
CustomLoadingScreen.prototype.displayLoadingUI = function () {
	alert(this.loadingUIText);
};
CustomLoadingScreen.prototype.hideLoadingUI = function () {
	alert("Loaded!");
};
engine.loadingScreen = new CustomLoadingScreen("loading");
engine.displayLoadingUI();

const createScene = async () => {
	const scene = new BABYLON.Scene(engine);

	// scene.createDefaultCameraOrLight(true, false, true);

	/* Lights */
	let lightWithGizmo;
	// const pointLight = new BABYLON.PointLight(
	// 	"pointLight",
	// 	new BABYLON.Vector3(0,5,0),
	// 	scene
	// );
	// lightWithGizmo = pointLight;

	// const spotLight = new BABYLON.SpotLight(
	// 	"spotLight",
	// 	new BABYLON.Vector3(0, 3, 0), // position of camera
	// 	new BABYLON.Vector3(0, -1, 0), // direction
	// 	Math.PI/2, // angle of light (width of circle)
	// 	1, // light-to-dark diffusion expontial
	// 	scene
	// );
	// spotLight.range = 5; // length of light
	// lightWithGizmo = spotLight;

	const directionalLight = new BABYLON.DirectionalLight(
		"directionalLight",
		new BABYLON.Vector3(-5, -5, 5), // light ray = origin to cordinate
		scene
	);
	directionalLight.intensity = 1;
	lightWithGizmo = directionalLight;

	// const hemisphereLight = new BABYLON.HemisphericLight(
	// 	"hemisphereLight",
	// 	new BABYLON.Vector3(-5, 5, 5), // light ray = cordinate to origin
	// 	scene
	// );
	// hemisphereLight.groundColor = new BABYLON.Color3(0, 0, 1); // color of light
	// hemisphereLight.diffuseColor = new BABYLON.Color3(0,0,1) // mesh color lit
	// hemisphereLight.specular = new BABYLON.Color3(1,1,0) // color of light spot
	// lightWithGizmo = hemisphereLight;

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
		alpha, // rotation around y-axis
		beta, // angle from y-axis
		radius, // initial distance from given cords
		new BABYLON.Vector3(0, 2, 0), // target cords for camera to face
		scene
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
	arcCam.lowerRadiusLimit = 5;
	arcCam.upperRadiusLimit = 20;

	/* Shape meshs */
	let shapeWithGizmo;
	const sphere = BABYLON.MeshBuilder.CreateSphere(
		"aSphere",
		{
			segments: 10,
			diameter: 1,
		},
		scene
	);
	sphere.position = new BABYLON.Vector3(2, 3, -3);
	const sphereMat = new BABYLON.StandardMaterial("sphereMat");
	sphereMat.diffuseColor = new BABYLON.Color3(0, 1, 0); // sets color of object in light
	sphereMat.specularColor = new BABYLON.Color3(1, 0, 1); // sets color of light spot
	sphereMat.ambientColor = new BABYLON.Color3(1, 1, 0); // sets max possible ambient color
	scene.ambientColor = new BABYLON.Color3(1, 0, 0); // sets ambience color in scene
	sphereMat.emissiveColor = new BABYLON.Color3(1, 0, 0); // sets color of object w/o light
	sphereMat.alpha = 1; // opacity
	sphereMat.diffuseTexture = new BABYLON.Texture("/public/assets/wood.jpg"); // texture req. light
	sphereMat.emissiveTexture = new BABYLON.Texture("/public/assets/wood.jpg"); // no req. light
	sphere.material = sphereMat;
	shapeWithGizmo = sphere;

	// const box = new BABYLON.MeshBuilder.CreateBox(
	// 	"aBox",
	// 	{
	// 		size: 5,
	// 		// faceColors: [new BABYLON.Color4(1, 0, 0, 1)],
	// 		faceUV: [
	// 			new BABYLON.Vector4(0, 0, 1 / 2, 1 / 2),
	// 			new BABYLON.Vector4(0, 1 / 2, 1 / 2, 1),
	// 		],
	// 		wrap: true,
	// 	},
	// 	scene
	// );
	// const boxMat = new BABYLON.StandardMaterial("boxMat");
	// boxMat.emissiveTexture = new BABYLON.Texture("/public/assets/wood.jpg");
	// box.material = boxMat;
	// box.position = new BABYLON.Vector3(5, 0, 0);
	// box.rotation = new BABYLON.Vector3(Math.PI / 3, 0, Math.PI / 4);
	// box.scaling = new BABYLON.Vector3(1, 1, 1);
	// shapeWithGizmo = box;

	/* Importing mesh */
	BABYLON.SceneLoader.ImportMesh(
		null, // null or "" imports all mesh, else looks for specific
		"/public/assets/models/",
		"Cow.gltf",
		scene,
		(meshes, particleSystems, skeletons, animationGroups) => {
			const cow = meshes[0];
			cow.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
			animationGroups[2].play(true);
		}
	);

	BABYLON.SceneLoader.ImportMeshAsync(
		null, // null or "" imports all mesh, else looks for specific
		"/public/assets/models/",
		"Cow.gltf",
		scene
	).then((result) => {
		const animatedGroups = result.animationGroups;
		animatedGroups[3].play(true);
	});

	/* Debugging tools */
	const utilityLayer = new BABYLON.UtilityLayerRenderer(scene);
	// const positionGizmo = new BABYLON.PositionGizmo(utilityLayer);
	// // Adds XYZ position, scaling, and rotation axes to box
	// positionGizmo.attachedMesh = shapeWithGizmo;
	// const scaleGizmo = new BABYLON.ScaleGizmo(utilityLayer);
	// scaleGizmo.attachedMesh = shapeWithGizmo;
	// const rotateGizmo = new BABYLON.RotationGizmo(utilityLayer);
	// rotateGizmo.attachedMesh = shapeWithGizmo; // Doesn't work if non-uniform scaling
	// const planeGizmo = new BABYLON.PlaneRotationGizmo(
	// 	new BABYLON.Vector3(0, 0, 1),
	// 	new BABYLON.Color3(1, 0, 0),
	// 	utilityLayer
	// );
	// planeGizmo.attachedMesh = shapeWithGizmo; // planeGizmo rotates on only 1 plane

	const lightGizmo = new BABYLON.LightGizmo(utilityLayer);
	lightGizmo.light = lightWithGizmo;

	/* Ground meshs */
	const groundHeightMap = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
		"hMap",
		"/public/assets/city_height_map.png",
		{
			height: 10,
			width: 10,
			subdivisions: 1000,
		},
		scene
	);
	groundHeightMap.receiveShadows = true;
	const grndHgtMat = new BABYLON.StandardMaterial("grndHgtMat");
	let texture = new BABYLON.Texture("/public/assets/wood.jpg");
	texture.uOffset = 0.5; // horizontal texture offset
	texture.vOffset = 0.5; // vertical texture offset
	texture.uScale = 1; // horizontal scale texture
	texture.vScale = 1; // vertical scale texture
	grndHgtMat.diffuseTexture = texture;
	groundHeightMap.material = grndHgtMat;
	groundHeightMap.material.wireframe = true;

	/* Text */
	const spellFont = await (
		await fetch("/public/assets/First_Order_Plain_Regular.json")
	).json();
	const sampleText = BABYLON.MeshBuilder.CreateText(
		"aText",
		"Unmute music then\nclick          sphere",
		spellFont,
		{
			size: 1,
			depth: 0.1,
			resolution: 100,
		},
		scene
	);
	sampleText!.setAbsolutePosition(new BABYLON.Vector3(0, 3, 0));

	/* Shadows */
	let shadowQuality = 1024;
	const shadowGenerator = new BABYLON.ShadowGenerator(
		shadowQuality,
		lightWithGizmo
	);
	shadowGenerator.addShadowCaster(shapeWithGizmo);
	// shadowGenerator.setDarkness(.2) // 0-1, lower number darker
	shadowGenerator.useBlurExponentialShadowMap = true; // shadow contouring
	shadowGenerator.useKernelBlur = true; // blurs edges
	shadowGenerator.blurKernel = 64; // blur quality

	/* Fog */
	// scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
	// scene.fogStart = 10; // distance fog starts (from camera)
	// scene.fogEnd = 20; // distance which hides mesh (from camera)

	scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
	scene.fogDensity = 0.1;
	scene.fogColor = new BABYLON.Color3(0, 0, 0); // fog color overlay on objects

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
	// const animation = new BABYLON.Animation(
	// 	"yRotation",
	// 	"rotation.y",
	// 	15,
	// 	BABYLON.Animation.ANIMATIONTYPE_FLOAT,
	// 	BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
	// );
	// const animationKeyFrames = [
	// 	{
	// 		frame: 0,
	// 		value: 0,
	// 	},
	// 	{
	// 		frame: 480,
	// 		value: 3 * Math.PI,
	// 	},
	// ];
	// animation.setKeys(animationKeyFrames);
	// box.animations = [animation];
	// const initialFrame = 0, finalFrame = 60;
	// scene.beginAnimation(box, initialFrame, finalFrame, false);

	const keyframes = [
		{
			frame: 0,
			value: alpha,
		},
		{
			frame: 480,
			value: (5 * Math.PI) / 2,
		},
	];
	const cameraSpinAnimate = new BABYLON.Animation(
		"cameraSpinAnimate",
		"alpha",
		15,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
	);
	cameraSpinAnimate.setKeys(keyframes);
	scene.beginAnimation(arcCam, 0, 480, true);

	const keyframesUpDown = [
		{
			frame: 0,
			value: beta,
		},
		{
			frame: 30,
			value: Math.PI / 2,
		},
	];
	const cameraUpDownAnimate = new BABYLON.Animation(
		"cameraUpDownAnimate",
		"beta",
		15,
		BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_YOYO
	);
	cameraUpDownAnimate.setKeys(keyframesUpDown);
	arcCam.animations = [cameraUpDownAnimate, cameraSpinAnimate];

	/* Action/Mouse-Keyboard events */
	let spinning = false;
	scene.onPointerDown = () => {
		const hit = scene.pick(scene.pointerX, scene.pointerY);

		if (hit.pickedMesh && hit.pickedMesh.name === "aSphere") {
			const r = Math.random(),
				g = Math.random(),
				b = Math.random();
			(<BABYLON.StandardMaterial>hit.pickedMesh.material).emissiveColor =
				new BABYLON.Color3(r, g, b);

			if (!spinning) {
				spinning = true;
				scene.beginAnimation(arcCam, 0, 480, true);
				sampleText?.dispose();
			}
		}
	};

	/* Sounds */
	const bgMusic = new BABYLON.Sound(
		"aSong",
		"/public/assets/LikeIDo.mp3",
		scene,
		null,
		{
			loop: true,
			autoplay: true,
		}
	);

	engine.hideLoadingUI();
	return scene;
};

var mainScene = await createScene();

engine.runRenderLoop(() => {
	mainScene.render();
	// No need to import inspector library
	// mainScene.debugLayer.show({
	// 	embedMode: true,
	// });
});

window.addEventListener("resize", () => {
	engine.resize();
});
