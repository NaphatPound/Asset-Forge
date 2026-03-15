import * as THREE from 'three';

const PAINT_TEX_SIZE = 512;

// Store paint canvases per block ID
const paintCanvases = new Map<string, HTMLCanvasElement>();
const paintTextures = new Map<string, THREE.CanvasTexture>();

export function getPaintCanvas(blockId: string): HTMLCanvasElement {
  if (paintCanvases.has(blockId)) {
    return paintCanvases.get(blockId)!;
  }
  const canvas = document.createElement('canvas');
  canvas.width = PAINT_TEX_SIZE;
  canvas.height = PAINT_TEX_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, PAINT_TEX_SIZE, PAINT_TEX_SIZE);
  paintCanvases.set(blockId, canvas);
  return canvas;
}

export function getPaintTexture(blockId: string): THREE.CanvasTexture {
  if (paintTextures.has(blockId)) {
    const tex = paintTextures.get(blockId)!;
    tex.needsUpdate = true;
    return tex;
  }
  const canvas = getPaintCanvas(blockId);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  paintTextures.set(blockId, texture);
  return texture;
}

export function paintOnCanvas(
  blockId: string,
  u: number,
  v: number,
  brushSize: number,
  brushColor: string,
  opacity: number = 1
): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;

  const x = u * PAINT_TEX_SIZE;
  const y = (1 - v) * PAINT_TEX_SIZE; // Flip Y for UV space

  ctx.globalAlpha = opacity;
  ctx.fillStyle = brushColor;
  ctx.beginPath();
  ctx.arc(x, y, brushSize * PAINT_TEX_SIZE * 0.02, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Update texture
  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

export function hasPaintData(blockId: string): boolean {
  return paintCanvases.has(blockId);
}

export function clearPaintData(blockId: string): void {
  const canvas = paintCanvases.get(blockId);
  if (canvas) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, PAINT_TEX_SIZE, PAINT_TEX_SIZE);
  }
  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

export function exportPaintDataURL(blockId: string): string | null {
  const canvas = paintCanvases.get(blockId);
  if (!canvas) return null;
  return canvas.toDataURL('image/png');
}

export function loadPaintData(blockId: string, dataURL: string): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, PAINT_TEX_SIZE, PAINT_TEX_SIZE);
    ctx.drawImage(img, 0, 0);
    const tex = paintTextures.get(blockId);
    if (tex) tex.needsUpdate = true;
  };
  img.src = dataURL;
}

/**
 * Scale the texture within a region (zoom in/out from center).
 */
export function scaleRegion(
  blockId: string,
  region: [number, number, number, number],
  scaleFactor: number
): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;
  const [uMin, vMin, uMax, vMax] = region;

  const rx = Math.floor(uMin * PAINT_TEX_SIZE);
  const ry = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
  const rw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
  const rh = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

  // Capture region
  const imgData = ctx.getImageData(rx, ry, rw, rh);
  const tmp = document.createElement('canvas');
  tmp.width = rw; tmp.height = rh;
  tmp.getContext('2d')!.putImageData(imgData, 0, 0);

  // Redraw scaled from center
  ctx.clearRect(rx, ry, rw, rh);
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();
  const cx = rx + rw / 2;
  const cy = ry + rh / 2;
  ctx.translate(cx, cy);
  ctx.scale(scaleFactor, scaleFactor);
  ctx.translate(-cx, -cy);
  ctx.drawImage(tmp, rx, ry, rw, rh);
  ctx.restore();

  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

/**
 * Rotate the texture within a region (from center).
 */
export function rotateRegion(
  blockId: string,
  region: [number, number, number, number],
  angleDeg: number
): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;
  const [uMin, vMin, uMax, vMax] = region;

  const rx = Math.floor(uMin * PAINT_TEX_SIZE);
  const ry = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
  const rw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
  const rh = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

  const imgData = ctx.getImageData(rx, ry, rw, rh);
  const tmp = document.createElement('canvas');
  tmp.width = rw; tmp.height = rh;
  tmp.getContext('2d')!.putImageData(imgData, 0, 0);

  ctx.clearRect(rx, ry, rw, rh);
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();
  const cx = rx + rw / 2;
  const cy = ry + rh / 2;
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  ctx.drawImage(tmp, rx, ry, rw, rh);
  ctx.restore();

  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

/**
 * Scale entire canvas from center.
 */
export function scaleFullCanvas(blockId: string, scaleFactor: number): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;
  const s = PAINT_TEX_SIZE;

  const imgData = ctx.getImageData(0, 0, s, s);
  const tmp = document.createElement('canvas');
  tmp.width = s; tmp.height = s;
  tmp.getContext('2d')!.putImageData(imgData, 0, 0);

  ctx.clearRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.scale(scaleFactor, scaleFactor);
  ctx.translate(-s / 2, -s / 2);
  ctx.drawImage(tmp, 0, 0);
  ctx.restore();

  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

/**
 * Rotate entire canvas from center.
 */
export function rotateFullCanvas(blockId: string, angleDeg: number): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;
  const s = PAINT_TEX_SIZE;

  const imgData = ctx.getImageData(0, 0, s, s);
  const tmp = document.createElement('canvas');
  tmp.width = s; tmp.height = s;
  tmp.getContext('2d')!.putImageData(imgData, 0, 0);

  ctx.clearRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.translate(-s / 2, -s / 2);
  ctx.drawImage(tmp, 0, 0);
  ctx.restore();

  const tex = paintTextures.get(blockId);
  if (tex) tex.needsUpdate = true;
}

export function disposePaintResources(blockId: string): void {
  paintCanvases.delete(blockId);
  const tex = paintTextures.get(blockId);
  if (tex) {
    tex.dispose();
    paintTextures.delete(blockId);
  }
}

/**
 * Fill a UV region with an image source (e.g. procedural texture canvas).
 * Region is [uMin, vMin, uMax, vMax] in UV space.
 */
export function fillRegionWithImage(
  blockId: string,
  region: [number, number, number, number],
  srcCanvas: HTMLCanvasElement | HTMLImageElement
): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;

  const [uMin, vMin, uMax, vMax] = region;

  // Convert UV to pixel coords (v is flipped)
  const px = Math.floor(uMin * PAINT_TEX_SIZE);
  const py = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
  const pw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
  const ph = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

  // Draw the source into the region
  ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, px, py, pw, ph);

  const paintTex = paintTextures.get(blockId);
  if (paintTex) paintTex.needsUpdate = true;
}

/**
 * Fill a UV region with a solid color.
 */
export function fillRegionWithColor(
  blockId: string,
  region: [number, number, number, number],
  color: string
): void {
  const canvas = getPaintCanvas(blockId);
  const ctx = canvas.getContext('2d')!;

  const [uMin, vMin, uMax, vMax] = region;
  const px = Math.floor(uMin * PAINT_TEX_SIZE);
  const py = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
  const pw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
  const ph = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(px, py, pw, ph);

  const paintTex = paintTextures.get(blockId);
  if (paintTex) paintTex.needsUpdate = true;
}

/**
 * Clear just one UV region.
 */
export function clearRegion(
  blockId: string,
  region: [number, number, number, number]
): void {
  const canvas = paintCanvases.get(blockId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;

  const [uMin, vMin, uMax, vMax] = region;
  const px = Math.floor(uMin * PAINT_TEX_SIZE);
  const py = Math.floor((1 - vMax) * PAINT_TEX_SIZE);
  const pw = Math.floor((uMax - uMin) * PAINT_TEX_SIZE);
  const ph = Math.floor((vMax - vMin) * PAINT_TEX_SIZE);

  ctx.clearRect(px, py, pw, ph);

  const paintTex = paintTextures.get(blockId);
  if (paintTex) paintTex.needsUpdate = true;
}
