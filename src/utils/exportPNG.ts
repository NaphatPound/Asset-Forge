import * as THREE from 'three';
import type { Block } from '../types/editor';
import { getBlockGeometry } from '../blocks/blockDefinitions';
import { applyFilter, type FilterType } from './imageFilters';
import { generateProceduralTexture } from './proceduralTextures';
import { ensureUVs } from './uvUnwrap';

export interface CameraSettings {
  azimuth: number;    // horizontal angle in degrees
  elevation: number;  // vertical angle in degrees
  distance: number;   // distance from center
}

export interface PNGExportOptions {
  width: number;
  height: number;
  transparent: boolean;
  cameraAngle?: 'front' | 'back' | 'left' | 'right' | 'top' | 'isometric';
  camera?: CameraSettings;
  supersample: number;
  filter?: FilterType;
}

export const CAMERA_PRESETS: Record<string, CameraSettings> = {
  front:     { azimuth: 0,   elevation: 15,  distance: 8 },
  back:      { azimuth: 180, elevation: 15,  distance: 8 },
  left:      { azimuth: -90, elevation: 15,  distance: 8 },
  right:     { azimuth: 90,  elevation: 15,  distance: 8 },
  top:       { azimuth: 0,   elevation: 89,  distance: 8 },
  isometric: { azimuth: 45,  elevation: 35,  distance: 8 },
};

function cameraSettingsToPosition(settings: CameraSettings): [number, number, number] {
  const azRad = (settings.azimuth * Math.PI) / 180;
  const elRad = (settings.elevation * Math.PI) / 180;
  const d = settings.distance;
  const x = d * Math.cos(elRad) * Math.sin(azRad);
  const y = d * Math.sin(elRad);
  const z = d * Math.cos(elRad) * Math.cos(azRad);
  return [x, y, z];
}

function buildScene(blocks: Block[]): THREE.Scene {
  const scene = new THREE.Scene();

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(10, 15, 10);
  scene.add(directional);

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
    scene.add(mesh);
  }

  return scene;
}

const BASE_DISTANCE = 8;

function fitCameraToScene(camera: THREE.OrthographicCamera, scene: THREE.Scene, distance: number) {
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) * 0.7;

  // Scale frustum by distance relative to base — larger distance = zoomed out
  const zoom = distance / BASE_DISTANCE;
  const frustum = maxDim * zoom;

  camera.left = -frustum;
  camera.right = frustum;
  camera.top = frustum;
  camera.bottom = -frustum;
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

function resolveCamera(options: PNGExportOptions): CameraSettings {
  if (options.camera) return options.camera;
  return CAMERA_PRESETS[options.cameraAngle || 'isometric'] || CAMERA_PRESETS.isometric;
}

export function renderToCanvas(blocks: Block[], options: PNGExportOptions): HTMLCanvasElement {
  const ss = options.supersample || 1;
  const w = options.width * ss;
  const h = options.height * ss;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: options.transparent,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(w, h);

  const scene = buildScene(blocks);

  if (!options.transparent) {
    scene.background = new THREE.Color('#1a1a2e');
  }

  const camSettings = resolveCamera(options);
  const camPos = cameraSettingsToPosition(camSettings);
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(...camPos);

  fitCameraToScene(camera, scene, camSettings.distance);
  renderer.render(scene, camera);

  // Downscale to target size
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(renderer.domElement, 0, 0, options.width, options.height);

  renderer.dispose();

  // Apply filter
  if (options.filter && options.filter !== 'none') {
    applyFilter(canvas, options.filter);
  }

  return canvas;
}

export function renderPreview(blocks: Block[], options: PNGExportOptions): HTMLCanvasElement {
  const previewSize = Math.min(options.width, 256);
  return renderToCanvas(blocks, {
    ...options,
    width: previewSize,
    height: previewSize,
    supersample: 1,
  });
}

export function exportPNG(blocks: Block[], options: PNGExportOptions): void {
  const canvas = renderToCanvas(blocks, options);
  const camSettings = resolveCamera(options);
  const angleName = options.cameraAngle || `az${Math.round(camSettings.azimuth)}_el${Math.round(camSettings.elevation)}`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprite_${angleName}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export function exportPNGBatch(blocks: Block[], options: Omit<PNGExportOptions, 'cameraAngle' | 'camera'>, angles: string[]): void {
  for (const angle of angles) {
    exportPNG(blocks, { ...options, cameraAngle: angle as PNGExportOptions['cameraAngle'] });
  }
}
