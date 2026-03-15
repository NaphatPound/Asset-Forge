import * as THREE from 'three';
import type { Block } from '../types/editor';
import { getBlockGeometry } from '../blocks/blockDefinitions';
import { generateProceduralTexture } from './proceduralTextures';
import { ensureUVs } from './uvUnwrap';

export async function exportGLTF(blocks: Block[], binary: boolean = true): Promise<void> {
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
  const exporter = new GLTFExporter();
  const scene = new THREE.Scene();

  for (const block of blocks) {
    if (!block.visible) continue;
    const geometry = ensureUVs(getBlockGeometry(block.type).clone());

    const materialOpts: THREE.MeshStandardMaterialParameters = {
      color: new THREE.Color(block.color),
      metalness: block.metalness,
      roughness: block.roughness,
    };

    if (block.textureType && block.textureType !== 'none') {
      const tex = generateProceduralTexture(block.textureType, block.color, block.textureScale);
      if (tex) {
        materialOpts.map = tex;
        materialOpts.color = new THREE.Color('#ffffff');
      }
    }

    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...block.position);
    mesh.rotation.set(
      (block.rotation[0] * Math.PI) / 180,
      (block.rotation[1] * Math.PI) / 180,
      (block.rotation[2] * Math.PI) / 180
    );
    mesh.scale.set(...block.scale);
    mesh.name = block.name;
    scene.add(mesh);
  }

  const options = { binary };
  const result = await new Promise<ArrayBuffer | object>((resolve, reject) => {
    exporter.parse(scene, resolve, reject, options);
  });

  if (binary) {
    const blob = new Blob([result as ArrayBuffer], { type: 'application/octet-stream' });
    downloadBlob(blob, 'model.glb');
  } else {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, 'model.gltf');
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
