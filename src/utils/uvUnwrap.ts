import * as THREE from 'three';

/**
 * UV layout: 6 regions in a 3x2 grid, one per face direction.
 * Each region is 1/3 wide x 1/2 tall in UV space:
 *
 *   +-------+-------+-------+
 *   |  +X   |  +Y   |  +Z   |  top row (v: 0.5 - 1.0)
 *   +-------+-------+-------+
 *   |  -X   |  -Y   |  -Z   |  bottom row (v: 0.0 - 0.5)
 *   +-------+-------+-------+
 *     0-0.33  0.33-0.66  0.66-1.0
 */

// Region definitions: [uMin, vMin, uMax, vMax]
const UV_REGIONS: Record<string, [number, number, number, number]> = {
  '+x': [0.0,    0.5, 0.3333, 1.0],
  '+y': [0.3333, 0.5, 0.6666, 1.0],
  '+z': [0.6666, 0.5, 1.0,    1.0],
  '-x': [0.0,    0.0, 0.3333, 0.5],
  '-y': [0.3333, 0.0, 0.6666, 0.5],
  '-z': [0.6666, 0.0, 1.0,    0.5],
};

export const UV_REGION_LABELS: { key: string; label: string; region: [number, number, number, number] }[] = [
  { key: '+x', label: '+X', region: UV_REGIONS['+x'] },
  { key: '+y', label: '+Y', region: UV_REGIONS['+y'] },
  { key: '+z', label: '+Z', region: UV_REGIONS['+z'] },
  { key: '-x', label: '-X', region: UV_REGIONS['-x'] },
  { key: '-y', label: '-Y', region: UV_REGIONS['-y'] },
  { key: '-z', label: '-Z', region: UV_REGIONS['-z'] },
];

function getFaceRegion(nx: number, ny: number, nz: number): [number, number, number, number] {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);

  if (ax >= ay && ax >= az) {
    return nx >= 0 ? UV_REGIONS['+x'] : UV_REGIONS['-x'];
  } else if (ay >= ax && ay >= az) {
    return ny >= 0 ? UV_REGIONS['+y'] : UV_REGIONS['-y'];
  } else {
    return nz >= 0 ? UV_REGIONS['+z'] : UV_REGIONS['-z'];
  }
}

/**
 * Auto UV unwrap with separated face islands.
 * Each face direction (+X, -X, +Y, -Y, +Z, -Z) maps to its own UV region.
 * Painting on one face won't affect others.
 */
export function autoUnwrapBoxProjection(geometry: THREE.BufferGeometry, scale: number = 1): THREE.BufferGeometry {
  const posAttr = geometry.getAttribute('position');
  const normalAttr = geometry.getAttribute('normal');

  if (!posAttr || !normalAttr) return geometry;

  const count = posAttr.count;
  const uvs = new Float32Array(count * 2);

  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  // Small margin inside each region to prevent bleeding
  const margin = 0.01;

  for (let i = 0; i < count; i++) {
    const px = posAttr.getX(i);
    const py = posAttr.getY(i);
    const pz = posAttr.getZ(i);
    const nx = normalAttr.getX(i);
    const ny = normalAttr.getY(i);
    const nz = normalAttr.getZ(i);

    // Get the UV region for this vertex based on its normal
    const [uMin, vMin, uMax, vMax] = getFaceRegion(nx, ny, nz);
    const regionW = uMax - uMin - margin * 2;
    const regionH = vMax - vMin - margin * 2;

    let localU: number, localV: number;
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    const az = Math.abs(nz);

    if (ax >= ay && ax >= az) {
      // X-facing: project onto YZ
      localU = (pz - box.min.z) / maxDim;
      localV = (py - box.min.y) / maxDim;
    } else if (ay >= ax && ay >= az) {
      // Y-facing: project onto XZ
      localU = (px - box.min.x) / maxDim;
      localV = (pz - box.min.z) / maxDim;
    } else {
      // Z-facing: project onto XY
      localU = (px - box.min.x) / maxDim;
      localV = (py - box.min.y) / maxDim;
    }

    // Clamp local UVs to [0, 1]
    localU = Math.max(0, Math.min(1, localU));
    localV = Math.max(0, Math.min(1, localV));

    // Map into the region
    uvs[i * 2] = (uMin + margin + localU * regionW) * scale;
    uvs[i * 2 + 1] = (vMin + margin + localV * regionH) * scale;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

/**
 * Check if a geometry has valid UV coordinates
 */
export function hasValidUVs(geometry: THREE.BufferGeometry): boolean {
  const uv = geometry.getAttribute('uv');
  if (!uv) return false;

  for (let i = 0; i < Math.min(uv.count, 10); i++) {
    if (uv.getX(i) !== 0 || uv.getY(i) !== 0) return true;
  }
  return false;
}

/**
 * Ensure geometry has proper UVs - always re-unwrap for painting support
 */
export function ensureUVs(geometry: THREE.BufferGeometry, scale: number = 1): THREE.BufferGeometry {
  if (!geometry.getAttribute('normal')) {
    geometry.computeVertexNormals();
  }
  // Always apply our box projection to ensure separated UV islands
  autoUnwrapBoxProjection(geometry, scale);
  return geometry;
}
