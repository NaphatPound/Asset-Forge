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

export function disposePaintResources(blockId: string): void {
  paintCanvases.delete(blockId);
  const tex = paintTextures.get(blockId);
  if (tex) {
    tex.dispose();
    paintTextures.delete(blockId);
  }
}
