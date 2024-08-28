import * as BABYLON from "@babylonjs/core";

export interface IScene {
	// TODO for future development/usecases
}

/**
 * Unlink meshes from the TransformNode (especially from .glTF) and dispose() TransformNodes
 */
export function chunkOutTransformNodesNotMeshes(
	meshes: BABYLON.AbstractMesh[]
): void {
	// Unlink meshes from the TransformNode from glTF and remove TransformNodes
	const dogMeshRoot = meshes[0];
	dogMeshRoot.getChildMeshes(false).forEach((dogMesh) => {
		dogMesh.setParent(dogMeshRoot);
	});
	dogMeshRoot
		.getChildTransformNodes(
			true,
			(node) => !(node instanceof BABYLON.AbstractMesh)
		)
		.forEach((transformNode) => {
			transformNode.dispose();
		});
}
