import * as THREE from 'three';
import type { Block } from '../types/editor';
import { getBlockGeometry } from '../blocks/blockDefinitions';
import { ensureUVs } from './uvUnwrap';

export async function exportOBJ(blocks: Block[]): Promise<void> {
  const { OBJExporter } = await import('three/examples/jsm/exporters/OBJExporter.js');
  const exporter = new OBJExporter();
  const scene = new THREE.Scene();

  for (const block of blocks) {
    if (!block.visible) continue;
    const geometry = ensureUVs(getBlockGeometry(block.type).clone());
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(block.color),
      metalness: block.metalness,
      roughness: block.roughness,
    });
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

  const result = exporter.parse(scene);
  const blob = new Blob([result], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.obj';
  a.click();
  URL.revokeObjectURL(url);
}
